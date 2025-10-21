import React from 'react';
import { motion } from 'framer-motion';
import { AVATAR_MAP } from '../avatars';
// --- REMOVED this failing import line ---
// import { AvatarStellar } from '../avatars/AvatarStellar'; 

interface CrownRevealProps {
    onFinish: () => void;
    data: any;
}

export const CrownRevealStep = ({ onFinish, data }: CrownRevealProps) => {
    
    // --- CHANGED this line ---
    // Instead of using the separate import, we just get "Stellar" from the map.
    const SelectedAvatar = AVATAR_MAP[data.avatar as keyof typeof AVATAR_MAP] || AVATAR_MAP['Stellar'];

    return (
        <div className="text-center flex flex-col items-center justify-center min-h-[400px]">
             <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay: 0.5, duration: 1}} className="relative w-32 h-32 mx-auto">
                <motion.div 
                    animate={{boxShadow: ['0 0 0px 0px rgba(14, 165, 233, 0)', '0 0 30px 10px rgba(14, 165, 233, 0.4)', '0 0 0px 0px rgba(14, 165, 233, 0)']}} 
                    transition={{duration: 2.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 1}} 
                    className="absolute inset-0 rounded-full" 
                />
                 <div className="absolute inset-0 flex items-center justify-center text-sky-400">
                    <SelectedAvatar isSelected />
                </div>
             </motion.div>
            
            <motion.h2 initial={{opacity:0, y: 20}} animate={{opacity:1, y: 0}} transition={{delay: 1, duration: 0.7}} className="text-2xl font-bold text-center text-gray-900 dark:text-white mt-8">
                Arise, O warrior of focus.
             </motion.h2>
             <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay: 1.5, duration: 0.7}} className="text-center text-gray-600 dark:text-gray-400 mt-4">
                 “Welcome, Ascender <span className="font-bold text-sky-400">@{data.username}</span>. You’ve taken your first vow of discipline.”
             </motion.p>
             <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay: 2, duration: 0.7}} className="text-center text-gray-600 dark:text-gray-400 mt-2 font-semibold">
                 The world scrolls — you ascend.
             </motion.p>
            
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: 2.5, duration: 0.5}}>
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                     onClick={onFinish}
                    className="mt-12 mx-auto px-8 bg-sky-500 text-white font-bold py-3 rounded-lg hover:bg-sky-600 transition-colors shadow-lg shadow-sky-500/20"
                >
                    Begin Your Ascent
                </motion.button>
             </motion.div>
        </div>
    );
};