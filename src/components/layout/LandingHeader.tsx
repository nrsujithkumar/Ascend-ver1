import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import { X, Menu } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Magnetic } from '../ui/Magnetic';

export const LandingHeader = () => {
    const [scrolled, setScrolled] = useState(false); //
    const [scrollHidden, setScrollHidden] = useState(false); //
    const [mouseAtTop, setMouseAtTop] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false); //
    const { scrollY, scrollYProgress } = useScroll(); //

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() || 0;
        setScrollHidden(latest > previous && latest > 150); //
        setScrolled(latest > 50); //
    });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => setMouseAtTop(e.clientY < 60); //
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto'; //
    }, [isMenuOpen]);

    const navLinks = [
        { name: 'Features', href: '#features' },
        { name: 'How It Works', href: '#how-it-works' },
        { name: 'About', href: '#about' },
    ]; //
    
    const navVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.5 } } }; //
    const navItemVariants = { hidden: { y: -20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120 } } }; //
    const isHidden = scrollHidden && !mouseAtTop;
    
    const handleJoinClick = () => {
        setIsMenuOpen(false);
        document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' }); //
    };
    
    const handleMenuLinkClick = () => setIsMenuOpen(false); //

    return (
        <>
            <motion.header
                variants={{ visible: { y: 0 }, hidden: { y: '-100%' } }}
                animate={isHidden ? 'hidden' : 'visible'}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isMenuOpen ? 'bg-white/50 dark:bg-[#0a0a0a]/50 backdrop-blur-2xl border-b border-gray-200/50 dark:border-white/10' : 'bg-transparent'}`}
            >
                <div className="container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                    <motion.a href="#home" className="text-2xl font-bold tracking-wider" whileHover={{ scale: 1.05 }}>
                        Ascend<span className="text-sky-400">.</span> {/* */}
                    </motion.a>
                    <motion.nav variants={navVariants} initial="hidden" animate="visible" className="hidden md:flex items-center gap-8">
                        {navLinks.map(link => (
                            <motion.a key={link.name} href={link.href} variants={navItemVariants} whileHover="hover" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-sky-500 dark:hover:text-sky-400 transition-colors relative">
                                <motion.span className="inline-block" variants={{ hover: { y: -2 } }} transition={{ type: 'spring', stiffness: 300, damping: 10 }}>
                                    {link.name} {/* */}
                                </motion.span>
                            </motion.a>
                        ))}
                    </motion.nav>
                    <div className="flex items-center gap-4">
                        <motion.button onClick={handleJoinClick} className="hidden md:inline-block bg-sky-500 text-white font-semibold text-sm px-4 py-2 rounded-full hover:bg-sky-600 transition-colors" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            Join Now {/* */}
                        </motion.button>
                        <Magnetic><ThemeToggle /></Magnetic>
                         <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 dark:text-gray-300">
                                 <AnimatePresence mode="wait">
                                    {isMenuOpen ?
                                    ( <motion.div key="close" initial={{opacity:0, rotate: 90}} animate={{opacity:1, rotate: 0}} exit={{opacity:0, rotate: 90}}><X size={24} /></motion.div> ) //
                                    : ( <motion.div key="menu" initial={{opacity:0, rotate: -90}} animate={{opacity:1, rotate: 0}} exit={{opacity:0, rotate: -90}}><Menu size={24} /></motion.div> )} {/* */}
                                </AnimatePresence>
                            </button>
                        </div>
                    </div>
                </div>
                <motion.div className="h-1 bg-sky-400 origin-left" style={{ scaleX: scrollYProgress }} /> {/* */}
            </motion.header>

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="fixed inset-0 z-40 bg-black/20 backdrop-blur-xl">
                         <motion.div initial={{ x: '100%' }} animate={{ x: '0%' }} exit={{ x: '100%' }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="fixed top-0 right-0 bottom-0 w-full max-w-xs bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-2xl border-l border-gray-200/50 dark:border-white/10 shadow-2xl flex flex-col items-center justify-center space-y-8">
                            {navLinks.map((link, i) => (
                                <motion.a key={link.name} href={link.href} onClick={handleMenuLinkClick} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.1 }} className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                                    {link.name}
                                </motion.a> //
                            ))}
                            <motion.button onClick={handleJoinClick} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 + navLinks.length * 0.1 }} className="bg-sky-500 text-white font-bold text-lg px-8 py-3 rounded-full">
                                Join Now {/* */}
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};