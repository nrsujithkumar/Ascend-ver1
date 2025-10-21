import React from 'react';
import { motion } from 'framer-motion';

export const FormError = ({ message }: { message: string }) => (
    <motion.p 
        initial={{ opacity: 0, y: -5 }} 
        animate={{ opacity: 1, y: 0 }} 
        exit={{ opacity: 0, y: -5 }} 
        className="text-red-500 text-xs mt-1 text-center"
    >
        {message}
    </motion.p>
);