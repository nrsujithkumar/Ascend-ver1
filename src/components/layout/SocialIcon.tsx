import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SocialIconProps {
    name: string;
    icon: ReactNode;
    href: string;
}

export const SocialIcon = ({ name, icon, href }: SocialIconProps) => {
    return (
        <motion.a 
            href={href} 
            aria-label={name} 
            className="relative text-gray-500 hover:text-sky-500 dark:hover:text-sky-400 transition-colors group" 
            whileHover="hover" 
            initial="rest" 
            target="_blank" 
            rel="noopener noreferrer"
        >
            {icon}
            <motion.div
                variants={{ rest: { opacity: 0, scale: 0.9, y: 5, pointerEvents: 'none' }, hover: { opacity: 1, scale: 1, y: 0, pointerEvents: 'auto' } }} //
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="absolute -top-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-semibold rounded-md whitespace-nowrap"
            >
                {name}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 dark:bg-white transform rotate-45"></div> {/* */}
            </motion.div>
        </motion.a>
    );
};