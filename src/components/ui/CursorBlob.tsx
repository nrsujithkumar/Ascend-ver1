import React, { useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

export const CursorBlob = ({ mouse }: { mouse: React.MutableRefObject<{ x: number, y: number }> }) => {
    const { theme } = useTheme(); //
    const x = useSpring(0, { stiffness: 150, damping: 40 }); //
    const y = useSpring(0, { stiffness: 150, damping: 40 }); //

    useEffect(() => {
        const move = (e: MouseEvent) => {
            mouse.current = { x: e.clientX, y: e.clientY };
            x.set(mouse.current.x); //
            y.set(mouse.current.y); //
        };
        window.addEventListener('mousemove', move); //
        return () => window.removeEventListener('mousemove', move);
    }, [x, y, mouse]);

    if (theme === 'light') return null; //

    return <motion.div style={{ 
        position: 'fixed', top: 0, left: 0, width: '400px', height: '400px', 
        borderRadius: '50%', backgroundColor: 'rgba(56, 189, 248, 0.3)', 
        filter: 'blur(120px)', translateX: '-50%', translateY: '-50%', 
        x, y, pointerEvents: 'none', zIndex: 0 
    }} />;
};