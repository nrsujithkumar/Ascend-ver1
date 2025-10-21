import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CursorBlob } from '../components/ui/CursorBlob';
import { DashboardNav } from '../pages/dashboard/DashboardNav';
import { ModalProvider } from '../contexts/ModalContext';

export const DashboardPage = () => {
    const mouse = React.useRef({ x: 0, y: 0 });
    const location = useLocation();

    return (
        <ModalProvider>
            <div className="bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 font-sans antialiased overflow-hidden min-h-screen">
                <div className="aurora-bg"></div>
                <CursorBlob mouse={mouse}/>
                <div className="relative z-10 min-h-screen flex flex-col">
                    <main className="flex-grow pt-4 px-4 pb-24 relative flex flex-col">
                       <AnimatePresence mode="wait">
                           <motion.div
                               key={location.pathname}
                               initial={{ opacity: 0, y: 20 }}
                               animate={{ opacity: 1, y: 0 }}
                               exit={{ opacity: 0, y: -20 }}
                               transition={{ duration: 0.2 }}
                               className="w-full flex-grow flex flex-col"
                           >
                               <Outlet />
                           </motion.div>
                       </AnimatePresence>
                    </main>
                    <DashboardNav />
                </div>
            </div>
        </ModalProvider>
    );
};