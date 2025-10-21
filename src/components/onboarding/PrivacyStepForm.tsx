import React from 'react';
import { motion } from 'framer-motion';

interface PrivacyStepProps {
    onNext: () => void;
    onBack: () => void;
    data: any;
    updateData: (data: any) => void;
}

export const PrivacyStepForm = ({ onNext, onBack, data, updateData }: PrivacyStepProps) => {
    const { privacyMode = 'Public' } = data;

    return (
        <div>
            <p className="text-center text-sky-400/80 mb-8">Chart Your Course: Public or Private</p>
            
            <div className="space-y-4">
                <motion.div
                    onClick={() => updateData({ privacyMode: 'Public' })}
                     className={`p-6 rounded-lg cursor-pointer border-2 transition-all ${privacyMode === 'Public' ? 'border-sky-500 bg-sky-500/10 shadow-lg' : 'border-gray-300/50 dark:border-gray-700/50 hover:border-sky-400/50 hover:bg-sky-500/5'}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                     <h3 className="font-bold text-gray-900 dark:text-white">Public Mode</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Share your streaks & posts on the public feed. Let your journey inspire others.</p>
                </motion.div>
                 <motion.div
                     onClick={() => updateData({ privacyMode: 'Private' })}
                    className={`p-6 rounded-lg cursor-pointer border-2 transition-all ${privacyMode === 'Private' ? 'border-sky-500 bg-sky-500/10 shadow-lg' : 'border-gray-300/50 dark:border-gray-700/50 hover:border-sky-400/50 hover:bg-sky-500/5'}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <h3 className="font-bold text-gray-900 dark:text-white">Private Mode</h3>
                     <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Only you and your AI coach can see your data. Your ascent is your own.</p>
                </motion.div>
            </div>

            <div className="flex justify-between items-center pt-8">
                <motion.button type="button" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onBack} className="px-6 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors">
                     Back
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                     onClick={onNext}
                    className="px-8 bg-sky-500 text-white font-bold py-3 rounded-lg hover:bg-sky-600 transition-colors shadow-lg shadow-sky-500/20"
                >
                    Next
                </motion.button>
            </div>
        </div>
    );
};