import React from 'react';
import { motion } from 'framer-motion';
import { Clan, useDatabase } from '../../contexts/DatabaseContext';

export const ClanCard = ({ clan, onSelect }: { clan: Clan; onSelect: () => void; }) => {
    const { userProfile, joinClan } = useDatabase();
    if (!userProfile) return null;
    
    const isMember = clan.members.includes(userProfile.uid);

    const handleJoinClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!isMember) {
            joinClan(clan.id);
        }
    };

    return (
        <motion.div
            onClick={onSelect}
            whileHover={{ y: -5, backgroundColor: 'rgba(255, 255, 255, 0.07)' }}
            className="bg-white/5 p-4 rounded-lg cursor-pointer border border-transparent flex flex-col"
        >
            <div className="flex-grow">
                <h4 className="font-bold text-white">{clan.name}</h4>
                <p className="text-sm text-gray-400 mt-1">{clan.description}</p>
            </div>
            <div className="flex justify-between items-center mt-4 pt-2 border-t border-white/10">
                <span className="text-xs text-gray-500">{clan.members.length} Members</span>
                {isMember ? (
                    <span className="text-xs font-bold text-green-400 bg-green-500/10 px-3 py-1 rounded-full">Member</span>
                ) : (
                    <motion.button onClick={handleJoinClick} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="bg-sky-500 text-white font-semibold text-xs px-4 py-1.5 rounded-full hover:bg-sky-600 transition-colors">
                        Join
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
};