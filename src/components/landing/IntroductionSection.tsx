import React, { useRef, useState } from 'react';
import { motion, useInView, useSpring } from 'framer-motion';
import { AnimatedWords } from '../ui/AnimatedWords';

export const IntroductionSection = () => {
    const ref = useRef(null); //
    const isInView = useInView(ref, { once: true, amount: 0.2 }); //
    const [startSubtextAnimation, setStartSubtextAnimation] = useState(false); //
    const rotateX = useSpring(0, { stiffness: 150, damping: 20, restDelta: 0.001 }); //
    const rotateY = useSpring(0, { stiffness: 150, damping: 20, restDelta: 0.001 }); //

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const { clientX, clientY, currentTarget } = e; //
        const { width, height, left, top } = currentTarget.getBoundingClientRect(); //
        const mouseX = clientX - left - width / 2; //
        const mouseY = clientY - top - height / 2; //
        rotateX.set((mouseY / (height / 2)) * -10); //
        rotateY.set((mouseX / (width / 2)) * 10); //
    };
    const handleMouseLeave = () => { rotateX.set(0); rotateY.set(0); }; //

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.2 } } }; //
    const headlineWordVariants = { hidden: { opacity: 0, y: 30, filter: 'blur(8px)' }, visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { type: 'spring', damping: 15, stiffness: 100 } } }; //
    const dotVariants = { hidden: { opacity: 0, scale: 0 }, visible: { opacity: 1, scale: 1, transition: { type: 'spring', damping: 12, stiffness: 200 } } }; //
    const pContainerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.03, delayChildren: 0.2 } } }; //
    const pWordVariants = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } }; //

    return (
        <section 
            ref={ref} 
            id="home" 
            className="min-h-screen flex flex-col justify-center items-center text-center relative overflow-hidden" 
            onMouseMove={handleMouseMove} 
            onMouseLeave={handleMouseLeave} 
            style={{ perspective: '1000px' }}
        >
            <motion.div className="container mx-auto px-4 sm:px-6 z-10" style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter flex flex-wrap justify-center items-baseline" style={{ transform: 'translateZ(50px)', transformStyle: 'preserve-3d' }}>
                   <AnimatedWords 
                        text="Forge Your Focus" 
                        wordVariants={headlineWordVariants} 
                        containerVariants={containerVariants} 
                        el="span" 
                        className="inline-block" 
                        animate={isInView ? "visible" : "hidden"} 
                        onAnimationComplete={() => setStartSubtextAnimation(true)} 
                    />
                   <motion.span 
                        variants={dotVariants} 
                        initial="hidden" 
                        animate={isInView ? "visible" : "hidden"} 
                        className="inline-block ml-2 md:ml-4"
                    >
                        <div className="w-3 h-3 md:w-5 md:h-5 lg:w-6 lg:h-6 bg-sky-400 rounded-full"></div>
                   </motion.span>
                </h1>
                <div style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}>
                     <AnimatedWords 
                        text="Stop scrolling through their lives and start building your own. Join a clan, track your grind, and make discipline your new addiction." 
                        wordVariants={pWordVariants} 
                        containerVariants={pContainerVariants} 
                        className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-gray-700 dark:text-gray-300" 
                        animate={startSubtextAnimation ? "visible" : "hidden"} 
                    />
                </div>
            </motion.div>
        </section>
    );
};