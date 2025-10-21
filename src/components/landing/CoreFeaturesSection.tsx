import React, { useRef } from 'react';
import { motion, useInView, useSpring } from 'framer-motion';
import { Flame, Users, Award, Shield, Eye, Sparkles } from 'lucide-react';

export const CoreFeaturesSection = () => {
    const features = [
        { title: "Daily Goal Tracking & Streaks", description: "Turn your goals into streaks and see your progress every day. Visual flames or progress bars make consistency satisfying.", icon: <Flame className="w-12 h-12 text-sky-400" /> }, //
        { title: "Clans & Accountability Groups", description: "Join communities to stay motivated. Leaderboards and group energy bars foster friendly competition.", icon: <Users className="w-12 h-12 text-sky-400" /> }, //
        { title: "Gamification & Rewards", description: "Earn badges, titles, and XP for your discipline. Weekly victory posters celebrate your wins.", icon: <Award className="w-12 h-12 text-sky-400" /> }, //
        { title: "Public & Private Goals", description: "Share goals with your clan or keep them private — you control visibility.", icon: <Shield className="w-12 h-12 text-sky-400" /> }, //
        { title: "Minimalist, Focused UX", description: "No endless scrolling — only progress and clarity. Dark/Focus mode reduces distractions.", icon: <Eye className="w-12 h-12 text-sky-400" /> }, //
        { title: "AI Mentor & Smart Nudges", description: "Get motivational tips, streak survival advice, and personalized goal ideas to kickstart your journey.", icon: <Sparkles className="w-12 h-12 text-sky-400" /> } //
    ];

    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    const rotateX = useSpring(0, { stiffness: 150, damping: 20, restDelta: 0.001 }); //
    const rotateY = useSpring(0, { stiffness: 150, damping: 20, restDelta: 0.001 }); //

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const { clientX, clientY, currentTarget } = e;
        const { width, height, left, top } = currentTarget.getBoundingClientRect();
        rotateX.set((clientY - top - height / 2) / (height / 2) * -5); //
        rotateY.set((clientX - left - width / 2) / (width / 2) * 5); //
    };
    const handleMouseLeave = () => { rotateX.set(0); rotateY.set(0); }; //

    const cardVariants = { 
        hidden: { opacity: 0, y: 50 }, 
        visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.6, -0.05, 0.01, 0.99], delay: i * 0.15 } }),
        hover: { y: -10, scale: 1.03, transition: { type: 'spring', stiffness: 300, damping: 15 } }
    }; //
    const iconVariants = { hover: { scale: 1.15, rotate: 15, transition: { type: 'spring', stiffness: 300, damping: 10 } } }; //

    return (
        <section 
            ref={ref} 
            onMouseMove={handleMouseMove} 
            onMouseLeave={handleMouseLeave} 
            style={{ perspective: '1000px' }} 
            id="features" 
            className="min-h-screen flex items-center py-24"
        >
            <motion.div className="container mx-auto px-4 sm:px-6" style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}>
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true, amount: 0.5 }} 
                    transition={{ duration: 0.7, ease: 'easeOut' }} 
                    className="text-4xl md:text-5xl font-extrabold text-center mb-16"
                >
                    Key Features for <span className="text-sky-400">Your Ascent.</span> {/* */}
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-6xl mx-auto">
                    {features.map((feature, i) => (
                        <motion.div 
                            key={feature.title} 
                            variants={cardVariants} 
                            custom={i} 
                            initial="hidden" 
                            animate={isInView ? "visible" : "hidden"} 
                            whileHover="hover" 
                            className="flex flex-col text-center gap-4 p-6 rounded-2xl bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 backdrop-blur-lg hover:bg-white/70 dark:hover:bg-white/10 transition-colors cursor-pointer"
                        >
                            <motion.div variants={iconVariants} className="flex-shrink-0 bg-sky-500/10 p-4 rounded-full mx-auto">
                                {feature.icon}
                            </motion.div> {/* */}
                            <div className="flex flex-col flex-grow">
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-gray-700 dark:text-gray-400 text-sm md:text-base flex-grow">{feature.description}</p> {/* */}
                            </div>
                        </motion.div>
                    ))}
                 </div>
            </motion.div>
        </section>
    );
};