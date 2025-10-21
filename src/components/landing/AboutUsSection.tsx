import React, { useRef } from 'react';
import { motion, useInView, useSpring } from 'framer-motion';

export const AboutUsSection = () => {
    const sectionRef = useRef(null); //
    const isInView = useInView(sectionRef, { once: true, amount: 0.3 }); //
    const rotateX = useSpring(0, { stiffness: 150, damping: 20, restDelta: 0.001 }); //
    const rotateY = useSpring(0, { stiffness: 150, damping: 20, restDelta: 0.001 }); //

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!sectionRef.current) return;
        const { clientX, clientY, currentTarget } = e; //
        const { width, height, left, top } = currentTarget.getBoundingClientRect(); //
        rotateX.set((clientY - top - height / 2) / (height / 2) * -5); //
        rotateY.set((clientX - left - width / 2) / (width / 2) * 5); //
    };
    const handleMouseLeave = () => { rotateX.set(0); rotateY.set(0); }; //

    const containerVariants = { hidden: { opacity: 1 }, visible: { opacity: 1, transition: { staggerChildren: 0.4, delayChildren: 0.2 } } }; //
    const pVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.2, 0.65, 0.3, 0.9] } } }; //

    return (
        <section 
            id="about" 
            ref={sectionRef} 
            onMouseMove={handleMouseMove} 
            onMouseLeave={handleMouseLeave} 
            style={{ perspective: '1000px' }} 
            className="min-h-screen flex items-center justify-center py-24"
        >
            <motion.div className="container mx-auto px-4 sm:px-6 text-center max-w-3xl" style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}>
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={isInView ? { opacity: 1, y: 0 } : {}} 
                    transition={{ duration: 0.7, ease: 'easeOut' }} 
                    className="text-4xl md:text-5xl font-extrabold mb-8"
                >
                    Our <span className="text-sky-400">Rebellion.</span> {/* */}
                </motion.h2>
                <motion.div 
                    variants={containerVariants} 
                    initial="hidden" 
                    animate={isInView ? "visible" : "hidden"} 
                    className="space-y-6 text-base md:text-lg text-gray-700 dark:text-gray-400"
                >
                    <motion.p variants={pVariants} whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}>We’re a crew of former pro-scrollers. Tired of algorithms stealing our time and potential, we decided to fight back.</motion.p> {/* */}
                    <motion.p variants={pVariants} whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}>We built Ascend for ourselves—and for anyone who believes their focus is worth defending.</motion.p>
                    <motion.p variants={pVariants} whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}>This is our answer to digital distraction. This is the anti-social media social app. Where <span className="text-gray-900 dark:text-white font-semibold">discipline</span>, <span className="text-gray-900 dark:text-white font-semibold">growth</span>, and <span className="text-gray-900 dark:text-white font-semibold">community</span> matter more than likes, endless feeds, or meaningless scrolls.</motion.p> {/* */}
                    <motion.p variants={pVariants} whileHover={{ scale: 1.03, transition: { duration: 0.2 } }} className="text-lg md:text-xl font-semibold text-sky-400 pt-4">Join the rebellion. Build your streaks. Rise above the noise.</motion.p> {/* */}
                </motion.div>
            </motion.div>
        </section>
    );
};