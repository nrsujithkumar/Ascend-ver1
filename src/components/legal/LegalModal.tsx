import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface LegalModalProps {
    title: string;
    content: ReactNode;
    onClose: () => void;
}

export const LegalModal = ({ title, content, onClose }: LegalModalProps) => {
    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.4 }} 
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
            <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }} 
                exit={{ scale: 0.95, opacity: 0, y: 20 }} 
                transition={{ duration: 0.4, ease: 'easeOut' }} 
                className="bg-white/80 dark:bg-[#101010]/80 border border-gray-200/50 dark:border-white/10 rounded-2xl w-full max-w-2xl relative flex flex-col" 
                style={{ maxHeight: '85vh' }}
            >
                <div className="p-6 border-b border-gray-200/50 dark:border-white/10 flex-shrink-0"> {/* */}
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"><X size={24} /></button> {/* */}
                </div>
                <div className="p-6 overflow-y-auto flex-grow custom-scrollbar">{content}</div> {/* */}
            </motion.div>
        </motion.div>
    );
};