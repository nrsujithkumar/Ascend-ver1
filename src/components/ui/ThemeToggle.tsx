import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme(); //
    return (
        <button 
            onClick={toggleTheme} 
            className="w-10 h-10 bg-white/50 dark:bg-white/5 backdrop-blur-md border border-gray-200/50 dark:border-white/10 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 hover:text-sky-500 dark:hover:text-sky-400 transition-all duration-300 scale-100 hover:scale-110"
        >
            <AnimatePresence mode="wait"> {/* */}
                <motion.div 
                    key={theme} 
                    initial={{opacity:0, rotate: -90}} 
                    animate={{opacity:1, rotate: 0}} 
                    exit={{opacity:0, rotate: 90}} 
                    transition={{duration: 0.2}}
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />} {/* */}
                </motion.div>
            </AnimatePresence>
        </button>
    );
};