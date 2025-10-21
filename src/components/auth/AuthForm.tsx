import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Eye, EyeOff } from 'lucide-react';

// --- FIREBASE IMPORTS ---
import {
    User,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    RecaptchaVerifier,
    signInWithPhoneNumber,
    ConfirmationResult
} from 'firebase/auth';
import { auth } from '../../firebase';

// Import UI components
import { AuthInput } from './AuthInput';
import { PasswordRule } from './PasswordRule';
import { PhoneInput } from './PhoneInput';
import { FormError } from '../ui/FormError';
import { VerificationForm } from './VerificationForm';

interface AuthFormProps {
    onClose: () => void;
    onSignupSuccess: (user: User, fullName: string) => void;
}

type PasswordValidation = {
    minLength: boolean;
    uppercase: boolean;
    lowercase: boolean;
    number: boolean;
    specialChar: boolean;
};

// --- HELPER FUNCTION FOR RECAPTCHA ---
const setupRecaptcha = () => { // <--- THIS IS THE FIX
    if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            'size': 'invisible',
            'callback': (response: any) => {
                console.log("reCAPTCHA solved");
            },
            'expired-callback': () => {
                console.log("reCAPTCHA expired");
            }
        });
    }
    return window.recaptchaVerifier;
};

declare global {
    interface Window {
        recaptchaVerifier?: RecaptchaVerifier;
        confirmationResult?: ConfirmationResult;
    }
}

export const AuthForm = ({ onClose, onSignupSuccess }: AuthFormProps) => {
    const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
    const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
    const [authStep, setAuthStep] = useState<'input' | 'otp'>('input');

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState(new Array(6).fill(""));

    const [errors, setErrors] = useState({ fullName: '', email: '', password: '', confirmPassword: '', phone: '', otp: '' });
    const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({ minLength: false, uppercase: false, lowercase: false, number: false, specialChar: false });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState('');

    // --- Validation Effects (No Change) ---
    useEffect(() => {
        if (authMode === 'signup' && fullName) {
            if (fullName.trim().length < 3) setErrors(prev => ({ ...prev, fullName: 'Full name must be at least 3 characters.' }));
            else setErrors(prev => ({ ...prev, fullName: '' }));
        } else {
             setErrors(prev => ({ ...prev, fullName: '' }));
        }
    }, [fullName, authMode]);

    useEffect(() => {
        if (email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) setErrors(prev => ({ ...prev, email: 'Please enter a valid email address.' }));
            else setErrors(prev => ({ ...prev, email: '' }));
        } else {
            setErrors(prev => ({ ...prev, email: '' }));
        }
    }, [email, authMode]);

    useEffect(() => {
        if (password) {
            setPasswordValidation({
                minLength: password.length >= 8,
                uppercase: /[A-Z]/.test(password),
                lowercase: /[a-z]/.test(password),
                number: /[0-9]/.test(password),
                specialChar: /[^A-Za-z0-9]/.test(password)
            });
        }
    }, [password]);

    useEffect(() => {
        if (authMode === 'signup' && confirmPassword) {
            if (password !== confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match.' }));
            else setErrors(prev => ({ ...prev, confirmPassword: '' }));
        } else {
             setErrors(prev => ({ ...prev, confirmPassword: '' }));
        }
    }, [confirmPassword, password, authMode]);

    const isSignupFormValid = !errors.fullName && !errors.email && !errors.confirmPassword && Object.values(passwordValidation).every(v => v);

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError('');
        setIsSubmitting(true);

        if (authMethod === 'email') {
            try {
                if (authMode === 'signup') {
                    if (!isSignupFormValid) throw new Error("Form is invalid");
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    onSignupSuccess(userCredential.user, fullName);
                } else {
                    const userCredential = await signInWithEmailAndPassword(auth, email, password);
                    console.log("Signed in user:", userCredential.user);
                    alert("Sign in successful!");
                    onClose();
                }
            } catch (error: any) {
                if (error.code === 'auth/email-already-in-use') {
                    setServerError('This email is already registered.');
                } else if (error.code === 'auth/invalid-credential') {
                    setServerError('Invalid email or password.');
                } else {
                    setServerError('An unknown error occurred. Please try again.');
                }
            } finally {
                setIsSubmitting(false);
            }
        }

        if (authMethod === 'phone') {
            try {
                const appVerifier = setupRecaptcha();
                const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier);
                window.confirmationResult = confirmationResult;
                setAuthStep('otp');
            } catch (error: any) {
                setServerError('Failed to send verification code. Please check the number and ensure reCAPTCHA is working.');
                console.error("Phone auth error:", error);
                if (window.recaptchaVerifier) {
                    window.recaptchaVerifier.render().then(widgetId => {
                        // @ts-ignore
                        window.grecaptcha.reset(widgetId);
                    });
                }
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setServerError('');
        setErrors(prev => ({ ...prev, otp: '' }));

        const code = otp.join("");

        if (code.length < 6) {
            setErrors(prev => ({ ...prev, otp: 'Code must be 6 digits.' }));
            setIsSubmitting(false);
            return;
        }

        if (!window.confirmationResult) {
            setServerError('Verification session expired. Please go back and try again.');
            setIsSubmitting(false);
            return;
        }

        try {
            const result = await window.confirmationResult.confirm(code);
            const user = result.user;
            console.log("Phone auth successful, user:", user);

            if (authMode === 'signup') {
                onSignupSuccess(user, fullName);
            } else {
                alert("Sign in successful!");
                onClose();
            }
        } catch (error: any) {
            if (error.code === 'auth/invalid-verification-code') {
                setErrors(prev => ({ ...prev, otp: 'Invalid code. Please try again.' }));
            } else {
                setServerError('An unknown error occurred.');
            }
            console.error("OTP confirm error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setAuthStep('input');
        setOtp(new Array(6).fill(""));
        setErrors({ fullName: '', email: '', password: '', confirmPassword: '', phone: '', otp: '' });
        setServerError('');
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={authStep}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
                {authStep === 'otp' ? (
                    <VerificationForm
                        otp={otp}
                        setOtp={setOtp}
                        error={errors.otp}
                        onSubmit={handleOtpSubmit}
                        isSubmitting={isSubmitting}
                        onBack={resetForm}
                    />
                ) : (
                    <>
                        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
                            {authMode === 'signup' ? 'Join the Rebellion' : 'Welcome Back'}
                        </h2>
                        <p className="text-center text-gray-600 dark:text-gray-400 mt-2 mb-6">
                            {authMode === 'signup' ?
                            'Create your account to start ascending.' : 'Sign in to continue your journey.'}
                        </p>
                        <div className="flex justify-center items-center my-6">
                            <div className="flex p-1 bg-gray-200/50 dark:bg-gray-800/50 rounded-full">
                                <button onClick={() => setAuthMethod('email')} className={`relative px-6 py-2 text-sm font-semibold rounded-full z-10 transition-colors flex items-center gap-2 ${authMethod === 'email' ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                                    <Mail size={16}/> Email
                                    {authMethod === 'email' && <motion.div layoutId="auth-method-indicator" className="absolute inset-0 bg-sky-500 rounded-full -z-10" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
                                </button>
                                <button onClick={() => setAuthMethod('phone')} className={`relative px-6 py-2 text-sm font-semibold rounded-full z-10 transition-colors flex items-center gap-2 ${authMethod === 'phone' ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                                    <Phone size={16}/> Phone
                                    {authMethod === 'phone' && <motion.div layoutId="auth-method-indicator" className="absolute inset-0 bg-sky-500 rounded-full -z-10" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
                                </button>
                            </div>
                        </div>
                        <form className="space-y-4" onSubmit={handleFormSubmit}>
                            {authMode === 'signup' && (
                                <div>
                                    <AuthInput type="text" placeholder="Full Name" id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} error={!!errors.fullName} />
                                    <AnimatePresence>{errors.fullName && <FormError message={errors.fullName} />}</AnimatePresence>
                                </div>
                            )}
                            {authMethod === 'email' ? (
                                <>
                                    <div>
                                        <AuthInput type="email" placeholder="Email Address" id="email" value={email} onChange={(e) => setEmail(e.target.value)} error={!!errors.email} />
                                        <AnimatePresence>{errors.email && <FormError message={errors.email} />}</AnimatePresence>
                                    </div>
                                    <div>
                                        <div className="relative">
                                            <AuthInput type={showPassword ? 'text' : 'password'} placeholder="Password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200">
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                    {authMode === 'signup' && password && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 p-2">
                                            <PasswordRule text="At least 8 characters" isValid={passwordValidation.minLength} />
                                            <PasswordRule text="One uppercase letter" isValid={passwordValidation.uppercase} />
                                            <PasswordRule text="One lowercase letter" isValid={passwordValidation.lowercase} />
                                            <PasswordRule text="One number" isValid={passwordValidation.number} />
                                            <PasswordRule text="One special character" isValid={passwordValidation.specialChar} />
                                        </motion.div>
                                    )}
                                    {authMode === 'signup' && (
                                        <div>
                                            <div className="relative">
                                                <AuthInput type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password" id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={!!errors.confirmPassword} />
                                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200">
                                                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                            <AnimatePresence>{errors.confirmPassword && <FormError message={errors.confirmPassword} />}</AnimatePresence>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div>
                                    <PhoneInput value={phone.replace(/^\+91/, '')} onChange={setPhone} error={errors.phone} />
                                    <AnimatePresence>{errors.phone && <FormError message={errors.phone} />}</AnimatePresence>
                                </div>
                            )}
                            <div className="pt-2">
                                <AnimatePresence>{serverError && <FormError message={serverError} />}</AnimatePresence>
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    type="submit"
                                    className="w-full bg-sky-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-600 transition-colors shadow-lg shadow-sky-500/20 disabled:bg-gray-500 disabled:shadow-none disabled:cursor-not-allowed"
                                    disabled={(authMode === 'signup' && authMethod === 'email' && !isSignupFormValid) || isSubmitting}
                                >
                                    {isSubmitting ? 'Processing...' : (authMethod === 'email' ? (authMode === 'signup' ? 'Create Account' : 'Sign In') : 'Send Code')}
                                </motion.button>
                            </div>
                            <div className="text-center pt-4">
                                <button type="button" onClick={() => { setAuthMode(authMode === 'signin' ? 'signup' : 'signin'); setServerError(''); }} className="text-sm font-semibold text-sky-500 hover:text-sky-400 transition-colors">
                                    {authMode === 'signin' ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </motion.div>
        </AnimatePresence>
    );
};