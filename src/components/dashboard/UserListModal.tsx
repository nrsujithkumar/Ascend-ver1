import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, User as UserIcon } from 'lucide-react';
import { useModal } from '../../contexts/ModalContext';
import { useDatabase, UserProfile } from '../../contexts/DatabaseContext';
import { AVATAR_MAP } from '../avatars';
import { Link } from 'react-router-dom';

const UserRow = ({ profile }: { profile: UserProfile }) => {
    const { hideModal } = useModal();
    const AvatarComponent = profile.avatar ? AVATAR_MAP[profile.avatar as keyof typeof AVATAR_MAP] : null;
    return (
        <Link to={`/dashboard/profile/${profile.uid}`} onClick={hideModal} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 no-underline">
            <div className="w-10 h-10 text-sky-400 flex-shrink-0">
                {AvatarComponent ? <AvatarComponent /> : <UserIcon />}
            </div>
            <div>
                <p className="font-bold text-sm text-white">{profile.fullName}</p>
                <p className="text-xs text-gray-400">@{profile.username}</p>
            </div>
            <div className="ml-auto bg-sky-500/80 text-white font-semibold text-xs px-4 py-1.5 rounded-full">
                View
            </div>
        </Link>
    );
};

interface UserListModalProps {
    title: string;
    userIds: string[];
}

export const UserListModal = ({ title, userIds }: UserListModalProps) => {
    const { hideModal } = useModal();
    const { getUser } = useDatabase();
    const [profiles, setProfiles] = useState<UserProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfiles = async () => {
            if (!userIds || userIds.length === 0) { setIsLoading(false); return; }
            const profilePromises = userIds.map(id => getUser(id));
            const fetchedProfiles = (await Promise.all(profilePromises)).filter(p => p !== null) as UserProfile[];
            setProfiles(fetchedProfiles);
            setIsLoading(false);
        };
        fetchProfiles();
    }, [userIds, getUser]);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={hideModal}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-gray-900/80 border border-white/10 rounded-2xl w-full max-w-sm flex flex-col" style={{ maxHeight: '70vh' }} onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-white/10 flex-shrink-0">
                    <h2 className="text-lg font-bold text-white text-center">{title}</h2>
                    <button onClick={hideModal} className="absolute top-3 right-3 text-gray-500 hover:text-white"><X size={20} /></button>
                </div>
                <div className="p-2 overflow-y-auto flex-grow custom-scrollbar">
                    {isLoading ? (<p className="text-center text-gray-400 p-4">Loading...</p>) : profiles.length > 0 ? (
                        <div className="flex flex-col gap-1">{profiles.map(p => <UserRow key={p.uid} profile={p} />)}</div>
                    ) : (<p className="text-center text-gray-400 p-4">No users to display.</p>)}
                </div>
            </motion.div>
        </motion.div>
    );
};