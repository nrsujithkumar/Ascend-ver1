import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Users, PlusCircle, Search, Bell, User as UserIcon } from 'lucide-react';
import { useDatabase } from '../../contexts/DatabaseContext'; // 1. We still need this hook
import { AVATAR_MAP } from '../../components/avatars';

const ProfileAvatar = () => {
    const { userProfile } = useDatabase();
    if (!userProfile?.avatar) {
        return <UserIcon className="w-full h-full" />;
    }
    const AvatarComponent = AVATAR_MAP[userProfile.avatar as keyof typeof AVATAR_MAP];
    return AvatarComponent ? <AvatarComponent isSelected /> : <UserIcon className="w-full h-full" />;
};

export const DashboardNav = () => {
    const location = useLocation();
    const { notifications } = useDatabase(); // 2. Get the notifications array from our context

    // 3. Check if there are any notifications where 'read' is false
    const hasUnread = notifications.some(n => !n.read);

    const navItems = [
        { name: 'Home', path: '/dashboard', icon: <Home /> },
        { name: 'Clan', path: '/dashboard/clan', icon: <Users /> },
        { name: 'Create', path: '/dashboard/create', icon: <PlusCircle /> },
        { name: 'Search', path: '/dashboard/search', icon: <Search /> },
        { name: 'Alerts', path: '/dashboard/alerts', icon: <Bell /> },
        { name: 'Profile', path: '/dashboard/profile', icon: <div className="w-full h-full p-0.5 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500"><div className="bg-gray-800 rounded-full w-full h-full flex items-center justify-center p-0.5"><ProfileAvatar /></div></div> },
    ];

    return (
        <footer className="fixed bottom-4 left-0 right-0 flex justify-center z-20">
            <div className="bg-white/50 dark:bg-[#101010]/50 backdrop-blur-2xl border border-gray-200/50 dark:border-white/10 rounded-2xl shadow-2xl px-2">
                <div className="flex justify-around items-center">
                    {navItems.map(item => {
                        const isActive = location.pathname === item.path;
                        return (
                            // 4. Add `relative` class to the NavLink to position the dot correctly
                            <NavLink key={item.name} to={item.path} className="no-underline relative">
                                
                                {/* --- 5. THIS IS THE NEW PART --- */}
                                {/* If this is the "Alerts" button AND there are unread notifications, show the dot */}
                                {item.name === 'Alerts' && hasUnread && (
                                    <motion.div 
                                        layoutId="alert-dot" 
                                        className="absolute top-3 right-4 w-2.5 h-2.5 rounded-full bg-sky-400 border-2 border-[#101010]" 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                    />
                                )}

                                <motion.button
                                    className={`relative flex flex-col items-center justify-center w-16 h-16 rounded-lg transition-colors group ${isActive ? 'text-sky-500' : 'text-gray-500 hover:text-sky-400'}`}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-background"
                                            className="absolute inset-2 bg-sky-500/10 rounded-xl"
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    <div className="w-6 h-6 flex items-center justify-center">{item.icon}</div>
                                    <span className="text-[10px] font-semibold mt-1">{item.name}</span>
                                </motion.button>
                            </NavLink>
                        );
                    })}
                </div>
            </div>
        </footer>
    );
};