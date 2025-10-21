import React from 'react';
import { motion } from 'framer-motion';
import { User } from 'firebase/auth';
import { AuthForm } from '../components/auth/AuthForm';
import { CursorBlob } from '../components/ui/CursorBlob';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom'; // 1. Import Link

// 2. Remove the onClose prop from the interface
interface AuthPageProps {
    onSignupSuccess: (user: User, fullName: string) => void;
}

export const AuthPage = ({ onSignupSuccess }: AuthPageProps) => {
    const mouse = React.useRef({ x: 0, y: 0 });

    return (
        <div className="bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 font-sans antialiased overflow-hidden min-h-screen">
            <div className="aurora-bg"></div>
            <CursorBlob mouse={mouse}/>
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-full max-w-md bg-white/50 dark:bg-[#101010]/50 backdrop-blur-2xl border border-gray-200/50 dark:border-white/10 rounded-2xl shadow-2xl p-8"
                >
                    {/* 3. Change the close button to a Link that navigates to "/" */}
                    <Link to="/" className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition-colors z-20">
                        <X size={24} />
                    </Link>
                    
                    {/* 4. Pass an empty function for the now-unused onClose prop */}
                    <AuthForm onClose={() => {}} onSignupSuccess={onSignupSuccess} />
                </motion.div>
            </div>
        </div>
    );
};