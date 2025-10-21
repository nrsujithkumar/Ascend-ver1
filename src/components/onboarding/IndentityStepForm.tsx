import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FormError } from '../ui/FormError';
import { useDatabase } from '../../contexts/DatabaseContext'; // <-- Import the hook
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

// This is a simple debounce hook
const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
};


interface IdentityStepProps {
    onNext: () => void;
    data: any;
    updateData: (data: any) => void;
    isFirstStep?: boolean;
}

type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken';

export const IdentityStepForm = ({ onNext, data, updateData, isFirstStep }: IdentityStepProps) => {
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // --- New states for username check ---
    const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle');
    const { checkUsernameUnique } = useDatabase(); // <-- Get the function
    const { username = '', mantra = '' } = data;
    
    // --- Debounce the username input ---
    const debouncedUsername = useDebounce(username, 500); // 500ms delay

    // --- Check username when debounced value changes ---
    useEffect(() => {
        const check = async () => {
            if (debouncedUsername.length < 3) {
                setUsernameStatus('idle');
                return;
            }
            setUsernameStatus('checking');
            const isUnique = await checkUsernameUnique(debouncedUsername);
            setUsernameStatus(isUnique ? 'available' : 'taken');
        };
        check();
    }, [debouncedUsername, checkUsernameUnique]);


    // Form is valid ONLY if username is available
    const isFormValid = usernameStatus === 'available' && mantra.trim().length > 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) {
            setError('Please fix the errors above.');
            return;
        }
        setError('');
        setIsSubmitting(true);
        // We don't need to simulate, just go next
        onNext();
    };

    const getUsernameMessage = () => {
        switch (usernameStatus) {
            case 'checking':
                return <span className="text-xs text-gray-500 flex items-center"><Loader2 className="mr-1 h-3 w-3 animate-spin" />Checking...</span>;
            case 'available':
                return <span className="text-xs text-green-500 flex items-center"><CheckCircle className="mr-1 h-3 w-3" />@{username} is available!</span>;
            case 'taken':
                return <span className="text-xs text-red-500 flex items-center"><XCircle className="mr-1 h-3 w-3" />@{username} is already taken.</span>;
            default:
                if (username.length > 0 && username.length < 3) {
                    return <span className="text-xs text-red-500">Must be at least 3 characters.</span>;
                }
                return null;
        }
    };

    return (
        <div>
            <p className="text-center text-sky-400/80 mb-8">Define Your Digital Soul</p>
            <form onSubmit={handleSubmit} className="space-y-6">
                 <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                    <div className={`flex items-center w-full px-4 py-3 bg-gray-200/50 dark:bg-gray-800/50 border border-transparent rounded-lg transition focus-within:ring-2 ${usernameStatus === 'taken' ? 'ring-2 ring-red-500' : 'focus-within:ring-sky-500'}`}>
                        <span className="text-gray-500 dark:text-gray-400">@</span>
                        <input id="username" type="text" placeholder="PriyaAscends" value={username} onChange={e => updateData({ username: e.target.value.replace(/[^a-zA-Z0-9_]/g, '') })} maxLength={14} className="w-full bg-transparent text-sm text-gray-900 dark:text-white focus:outline-none ml-1" />
                    </div>
                    <div className="h-4 mt-1 px-1">
                        {getUsernameMessage()}
                    </div>
                </div>

                <div>
                    <label htmlFor="mantra" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Mantra or Mission</label>
                    <textarea id="mantra" placeholder="e.g., 'Discipline equals freedom.'" value={mantra} onChange={e => updateData({ mantra: e.target.value })} maxLength={50} rows={2} className="w-full px-4 py-3 text-sm text-gray-900 dark:text-white bg-gray-200/50 dark:bg-gray-800/50 border border-transparent rounded-lg focus:outline-none transition focus:ring-2 focus:ring-sky-500 focus:border-transparent" />
                </div>

                <AnimatePresence>{error && <FormError message={error} />}</AnimatePresence>

                <div className={`flex ${isFirstStep ? 'justify-end' : 'justify-between'} items-center pt-4`}>
                    {!isFirstStep && (
                         <motion.button type="button" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => {}} className="px-6 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors">
                            Back
                        </motion.button>
                    )}
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} type="submit" className="px-8 bg-sky-500 text-white font-bold py-3 rounded-lg hover:bg-sky-600 transition-colors shadow-lg shadow-sky-500/20 disabled:bg-gray-500 disabled:shadow-none disabled:cursor-not-allowed" disabled={!isFormValid || isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Next'}
                    </motion.button>
                </div>
            </form>
        </div>
    );
};