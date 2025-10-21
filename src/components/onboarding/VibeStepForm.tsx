import React from 'react';
import { motion } from 'framer-motion';

interface VibeStepProps {
    onNext: () => void;
    onBack: () => void;
    data: any;
    updateData: (data: any) => void;
}

export const VibeStepForm = ({ onNext, onBack, data, updateData }: VibeStepProps) => {
    const { vibe: selectedVibe } = data;
    const vibes = [
        { name: 'The Hustler', icon: '🔥', description: 'Driven by progress and power.' },
        { name: 'The Seeker', icon: '🌿', description: 'Calm, mindful, and wise.' },
        { name: 'The Creator', icon: '⚡', description: 'Expressive and bold.' },
        { name: 'The Dreamer', icon: '🌙', description: 'Visionary, inspired, free.' },
        { name: 'The Monk', icon: '🧘', description: 'Minimalist, disciplined, detached.' },
    ];

    return (
        <div>
            <p className="text-center text-sky-400/80 mb-8">Select Your Core Essence</p>
            <div className="space-y-4">
                {vibes.map(vibe => (
                    <motion.div
                         key={vibe.name}
                        onClick={() => updateData({ vibe: vibe.name })}
                        className={`p-4 rounded-lg cursor-pointer border-2 transition-all ${selectedVibe === vibe.name ? 'border-sky-500 bg-sky-500/10 shadow-lg' : 'border-gray-300/50 dark:border-gray-700/50 hover:border-sky-400/50 hover:bg-sky-500/5'}`}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-3xl">{vibe.icon}</span>
                           <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">{vibe.name}</h3>
                                <p className="text-xs text-gray-600 dark:text-gray-400">{vibe.description}</p>
                           </div>
                        </div>
                    </motion.div>
                ))}
             </div>
            
             <div className="flex justify-between items-center pt-8">
                <motion.button type="button" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onBack} className="px-6 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors">
                    Back
                 </motion.button>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onNext} className="px-8 bg-sky-500 text-white font-bold py-3 rounded-lg hover:bg-sky-600 transition-colors shadow-lg shadow-sky-500/20 disabled:bg-gray-500 disabled:shadow-none disabled:cursor-not-allowed" disabled={!selectedVibe}>
                    Next
                </motion.button>
            </div>
        </div>
    )
}