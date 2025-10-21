import React, { useRef, ChangeEvent, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { FormError } from '../ui/FormError';

interface VerificationFormProps {
    otp: string[];
    setOtp: (otp: string[]) => void;
    error: string;
    onSubmit: (e: React.FormEvent) => void;
    isSubmitting: boolean;
    onBack: () => void;
}

export const VerificationForm = ({ otp, setOtp, error, onSubmit, isSubmitting, onBack }: VerificationFormProps) => {
    // We use an array of refs to manage focus between input boxes
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        if (/[^0-9]/.test(value)) return; // Only allow numbers

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move focus to the next input if a number is entered
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        // Move focus to the previous input on backspace if current is empty
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <div className="text-center">
            <button onClick={onBack} className="absolute top-4 left-4 text-gray-500 hover:text-gray-200">
                <ArrowLeft size={24}/>
            </button>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Enter Code</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2 mb-8">We sent a verification code to your device.</p>
            <form onSubmit={onSubmit}>
                <div className="flex justify-center gap-2 mb-4">
                    {otp.map((data, index) => (
                        <input 
                            key={index} 
                            type="text" // Use "text" to allow single char
                            inputMode="numeric" // Helps mobile users
                            value={data} 
                            onChange={e => handleChange(e, index)} 
                            onKeyDown={e => handleKeyDown(e, index)} 
                            maxLength={1} 
                            ref={el => (inputRefs.current[index] = el)} 
                            className="w-12 h-14 text-center text-2xl font-bold bg-gray-200/50 dark:bg-gray-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" 
                        />
                    ))}
                </div>
                <AnimatePresence>{error && <FormError message={error} />}</AnimatePresence>
                <motion.button 
                    type="submit" 
                    whileHover={{ scale: 1.03 }} 
                    whileTap={{ scale: 0.97 }} 
                    disabled={isSubmitting} 
                    className="w-full mt-6 bg-sky-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-600 transition-colors disabled:bg-gray-500"
                >
                    {isSubmitting ? 'Verifying...' : 'Verify'}
                </motion.button>
            </form>
        </div>
    );
};