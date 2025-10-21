import React from 'react';
// --- FIX: Added the 'type' keyword before 'Variants' ---
import { motion, type Variants } from 'framer-motion';

interface AnimatedWordsProps {
    text: string;
    el?: keyof JSX.IntrinsicElements;
    className?: string;
    wordVariants: Variants;
    containerVariants: Variants;
    animate: any;
    onAnimationComplete?: () => void;
}

export const AnimatedWords = ({ 
    text, 
    el: Wrapper = 'p', 
    className, 
    wordVariants, 
    containerVariants, 
    animate, 
    onAnimationComplete 
}: AnimatedWordsProps) => {
    const words = text.split(' ');
    const MotionWrapper = motion[Wrapper];

    return (
        <MotionWrapper 
            className={className} 
            variants={containerVariants} 
            initial="hidden" 
            animate={animate} 
            onAnimationComplete={onAnimationComplete}
        >
            {words.map((word, i) => (
                <motion.span 
                    key={i} 
                    variants={wordVariants} 
                    style={{ display: 'inline-block', willChange: 'transform, opacity' }}
                >
                    {word + (i !== words.length - 1 ? '\u00A0' : '')}
                </motion.span>
            ))}
        </MotionWrapper>
    );
};