import React from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon } from 'lucide-react';
import { useDatabase, UserProfile } from '../../contexts/DatabaseContext';
import { AVATAR_MAP } from '../avatars';
import { Link } from 'react-router-dom';

export const UserCard = ({ user }: { user: UserProfile }) => {
    const { userProfile, followUser, unfollowUser } = useDatabase();
    if (!userProfile) return null;

    const isFollowing = userProfile.following?.includes(user.uid);
    const AvatarComponent = user.avatar ? AVATAR_MAP[user.avatar as keyof typeof AVATAR_MAP] : null;

    const handleToggleFollow = () => {
        if (isFollowing) {
            unfollowUser(user.uid);
        } else {
            followUser(user.uid);
        }
    };

    return (
        <div className="bg-white/5 dark:bg-black/10 p-3 rounded-lg border border-gray-200/50 dark:border-white/10 flex items-center gap-4">
             <Link to={`/dashboard/profile/${user.uid}`} className="flex items-center gap-4 flex-grow no-underline">
                <div className="w-10 h-10 text-sky-400 flex-shrink-0">
                    {AvatarComponent ? <AvatarComponent /> : <UserIcon />}
                </div>
                <div>
                    <h4 className="font-bold text-white">{user.username}</h4>
                    <p className="text-xs text-gray-500 truncate max-w-[150px]">{user.mantra}</p>
                </div>
            </Link>
            
            {user.uid !== userProfile.uid && (
                <motion.button onClick={handleToggleFollow} whileHover={{scale: 1.05}} whileTap={{scale: 0.95}} className={`ml-auto font-semibold text-xs px-4 py-1.5 rounded-full transition-colors ${isFollowing ? 'bg-white/10 text-white' : 'bg-sky-500 text-white'}`}>
                    {isFollowing ? 'Following' : 'Follow'}
                </motion.button>
            )}
        </div>
    );
};