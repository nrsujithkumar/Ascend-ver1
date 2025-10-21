import React from 'react';
import { motion } from 'framer-motion';
import { EarlyRisersLogo } from '../icons/EarlyRisersLogo';

interface GoalStepProps {
    onNext: () => void;
    onBack: () => void;
    data: any;
    updateData: (data: any) => void;
}

export const GoalStepForm = ({ onNext, onBack, data, updateData }: GoalStepProps) => {
    
    const handleAccept = () => {
        updateData({ goal: 'Early Risers' });
        onNext();
    };

    const handleSkip = () => {
        updateData({ goal: 'Skipped' });
        onNext();
    };
    
    return (
        <div>
            <p className="text-center text-sky-400/80 mb-8">Take Your First Vow of Discipline</p>

            <div className="p-6 border-2 border-sky-500/20 rounded-lg text-center bg-sky-500/5">
                <div className="flex justify-center items-center mb-4">
                    <EarlyRisersLogo />
                 </div>
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white">The Early Risers Clan</h3>
                <p className="text-gray-600 dark:text-gray-400 mt-2 mb-4">Commit to waking up between 4 AM - 6 AM daily.</p>
                <p className="text-sm italic text-gray-500 dark:text-gray-500">“In Brahma Muhūrta, the mind is serene, the senses pure, and willpower divine.”</p>
                 <p className="text-xs text-right text-gray-500 dark:text-gray-500 mt-2">— Atharva Veda</p>
            </div>
            
            <div className="flex justify-between items-center pt-8">
                <motion.button type="button" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onBack} className="px-6 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors">
                     Back
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                     onClick={handleSkip}
                    className="px-6 text-sky-500 font-bold py-3 rounded-lg hover:text-sky-600 transition-colors"
                >
                    Skip for now
                </motion.button>
                 <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAccept}
                    className="px-8 bg-sky-500 text-white font-bold py-3 rounded-lg hover:bg-sky-600 transition-colors shadow-lg shadow-sky-500/20"
                >
                    Accept & Join
                </motion.button>
            </div>
        </div>
    )
};