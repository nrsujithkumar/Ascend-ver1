import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// This is the component's Props type
interface PreloaderProps {
    onComplete: () => void;
}

export const Preloader = ({ onComplete }: PreloaderProps) => {
    const words = ["Set", "Track", "Achieve", "Ascend"];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (index === words.length - 1) return;
        
        // --- CHANGE: Increased delay from 500ms to 700ms ---
        const timer = setTimeout(() => setIndex(index + 1), 700); 
        
        return () => clearTimeout(timer);
    }, [index, words.length]);

    const handleAnimationComplete = () => setTimeout(onComplete, 200);

    const currentWord = words[index];
    const isLastWord = index === words.length - 1;

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center">
             <div className="text-5xl font-bold text-gray-900 dark:text-white overflow-hidden h-16 flex items-center">
                 <motion.div
                    key={index}
                    initial={{ y: "110%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "-110%" }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center justify-center"
                >
                    <span>{currentWord}</span>
                    
                    {/* --- CHANGE: Removed the dot for non-last words --- */}
                    {/* {!isLastWord && <span>.</span>} */} 
                    
                    {isLastWord && (
                        <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.3 }}
                            className="text-sky-400"
                            onAnimationComplete={handleAnimationComplete}
                        >
                        .
                        </motion.span>
                    )}
                 </motion.div>
            </div>
        </div>
    );
};