import React, { useRef } from 'react';
import { motion, useSpring } from 'framer-motion';
import { Magnetic } from '../ui/Magnetic';
import { Link } from 'react-router-dom'; // 1. Import Link from react-router-dom

// 2. Remove the onBeginAscent prop
export const CTASection = () => {
    const ref = useRef(null);
    const rotateX = useSpring(0, { stiffness: 150, damping: 20, restDelta: 0.001 });
    const rotateY = useSpring(0, { stiffness: 150, damping: 20, restDelta: 0.001 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const { clientX, clientY, currentTarget } = e;
        const { width, height, left, top } = currentTarget.getBoundingClientRect();
        rotateX.set((clientY - top - height / 2) / (height / 2) * -5);
        rotateY.set((clientX - left - width / 2) / (width / 2) * 5);
    };
    const handleMouseLeave = () => { rotateX.set(0); rotateY.set(0); };

    return (
        <section
            id="join"
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: '1000px' }}
            className="min-h-screen flex items-center justify-center py-24"
        >
            <motion.div className="container mx-auto px-4 sm:px-6 text-center" style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}>
                 <motion.div
                    key="button"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, type: 'spring' }}
                 >
                     <Magnetic>
                         {/* 3. Wrap the button in a Link component that points to "/auth" */}
                         <Link to="/auth">
                            <motion.button
                                className="cta-button relative inline-block bg-sky-500 text-white font-bold text-base md:text-lg px-8 py-4 md:px-10 md:py-5 rounded-full shadow-lg shadow-sky-500/30 hover:bg-sky-600 transition-all duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                animate={{ boxShadow: ['0 0 0 0px rgba(2, 132, 199, 0.4)', '0 0 0 20px rgba(2, 132, 199, 0)', '0 0 0 0px rgba(2, 132, 199, 0)'], }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', times: [0, 0.5, 1] }}
                            >
                                 Begin Your Ascent
                            </motion.button>
                        </Link>
                    </Magnetic>
                </motion.div>
            </motion.div>
         </section>
    );
};