import React from 'react';
import { motion } from 'framer-motion';

interface AchievementIconProps {
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
}

export const AchievementIcon = ({ name, description, icon, unlocked }: AchievementIconProps) => {
    return (
        <div className="relative group flex flex-col items-center text-center cursor-pointer">
            <div className="absolute bottom-full mb-3 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <p className="font-bold">{name}</p>
                <p className="text-gray-300">{description}</p>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
            </div>
            <motion.div className={`p-3 rounded-lg transition-all duration-300 ${unlocked ? 'bg-yellow-500/20' : 'bg-white/5'}`} whileHover={{ scale: 1.1, y: -5 }}>
                <span className={`text-3xl transition-all duration-300 ${unlocked ? 'grayscale-0' : 'grayscale'}`}>{icon}</span>
            </motion.div>
            <span className={`text-xs mt-1 font-semibold transition-colors duration-300 ${unlocked ? 'text-yellow-400' : 'text-gray-500'}`}>{name}</span>
        </div>
    );
};