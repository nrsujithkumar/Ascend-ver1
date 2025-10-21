import React, { useRef } from 'react';
import { motion, useInView, useSpring } from 'framer-motion';
import { Target, CheckSquare, Flame, Users, Award, Sparkles } from 'lucide-react';

export const HowItWorksSection = () => {
    const steps = [
        { title: '1. Set a Goal', description: 'Choose a public or private goal, like "Wake up at 5:30 AM" or "Study 2 hours daily". You set the mission.', icon: <Target size={48} className="text-sky-400"/> }, //
        { title: '2. Daily Check-In', description: 'Provide your proof of discipline with a one-tap confirmation, a quick photo, or a short note.', icon: <CheckSquare size={48} className="text-sky-400"/> }, //
        { title: '3. Build Your Streak', description: 'Each check-in fuels your streak flame. Stay consistent to grow your status and recognition.', icon: <Flame size={48} className="text-sky-400"/> }, //
        { title: '4. Join a Clan', description: 'Team up with a small group for accountability. Climb the leaderboard and boost your clan\'s energy bar together.', icon: <Users size={48} className="text-sky-400"/> }, //
        { title: '5. Earn Rewards', description: 'Hit milestones to earn badges, XP, and titles. Celebrate with shareable weekly Victory Posters.', icon: <Award size={48} className="text-sky-400"/> }, //
        { title: '6. Get AI Nudges', description: 'Receive motivational tips and smart reminders from your AI Mentor to keep your streak alive.', icon: <Sparkles size={48} className="text-sky-400"/> }, //
    ];
    
    const sectionRef = useRef(null); //
    const isInView = useInView(sectionRef, { once: true, amount: 0.2 }); //
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

    const cardVariants = { 
        hidden: { opacity: 0, y: 50 }, 
        visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99], delay: i * 0.1 } }),
        hover: { y: -10, scale: 1.03, transition: { type: 'spring', stiffness: 300, damping: 15 } }
    }; //
    const iconVariants = { hover: { scale: 1.1, rotate: 10, transition: { type: 'spring', stiffness: 250, damping: 10 } } }; //

    return (
        <section 
            id="how-it-works" 
            ref={sectionRef} 
            onMouseMove={handleMouseMove} 
            onMouseLeave={handleMouseLeave} 
            style={{ perspective: '1000px' }} 
            className="min-h-screen flex items-center justify-center py-24"
        >
            <motion.div className="container mx-auto px-4 sm:px-6" style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}>
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    viewport={{ once: true, amount: 0.5 }} 
                    transition={{ duration: 0.7, ease: 'easeOut' }} 
                    className="text-4xl md:text-5xl font-extrabold text-center mb-16"
                >
                    How Goals Work in <span className="text-sky-400">Ascend.</span> {/* */}
                </motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-6xl mx-auto">
                    {steps.map((step, i) => (
                          <motion.div 
                            key={step.title} 
                            variants={cardVariants} 
                            custom={i} 
                            initial="hidden" 
                            animate={isInView ? "visible" : "hidden"} 
                            whileHover="hover" 
                            className="text-center p-6 rounded-2xl bg-white/50 dark:bg-white/5 border border-gray-200/50 dark:border-white/10 backdrop-blur-lg hover:bg-white/70 dark:hover:bg-white/10 transition-colors"
                          >
                            <motion.div variants={iconVariants} className="inline-block mb-6 p-4 bg-sky-500/10 rounded-full">
                                {step.icon}
                            </motion.div> {/* */}
                            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                            <p className="text-gray-700 dark:text-gray-400 text-sm md:text-base">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};