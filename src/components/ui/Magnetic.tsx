import React, { useState, useRef, type ReactNode } from 'react';
import { motion } from 'framer-motion';

export const Magnetic = ({ children }: { children: ReactNode }) => {
    const ref = useRef<HTMLDivElement>(null); //
    const [position, setPosition] = useState({ x: 0, y: 0 }); //

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => { //
        if (!ref.current) return;
        const { clientX, clientY } = e; //
        const { height, width, left, top } = ref.current.getBoundingClientRect(); //
        setPosition({ x: clientX - (left + width / 2), y: clientY - (top + height / 2) }); //
    };

    const handleMouseLeave = () => setPosition({ x: 0, y: 0 }); //

    const { x, y } = position;
    return (
        <motion.div 
            ref={ref} 
            onMouseMove={handleMouseMove} 
            onMouseLeave={handleMouseLeave} 
            animate={{ x, y }} 
            transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
        >
            {children}
        </motion.div>
    );
};