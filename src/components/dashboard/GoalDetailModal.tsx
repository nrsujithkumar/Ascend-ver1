// Filename: src/components/dashboard/GoalDetailModal.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Goal, useDatabase } from '../../contexts/DatabaseContext';
import { useModal } from '../../contexts/ModalContext';
import { PostCard } from './PostCard';

export const GoalDetailModal = ({ goal }: { goal: Goal }) => {
    const { hideModal } = useModal();
    const { feedPosts } = useDatabase();

    const goalPosts = feedPosts.filter(post => post.goalId === goal.id);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={hideModal}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-gray-900/80 border border-white/10 rounded-2xl w-full max-w-lg flex flex-col" style={{ maxHeight: '85vh' }} onClick={(e) => e.stopPropagation()}>
                <div className="p-4 border-b border-white/10">
                    <h2 className="text-lg font-bold text-white">{goal.title}</h2>
                    <p className="text-sm text-gray-400 mt-1">{goal.description}</p>
                    <button onClick={hideModal} className="absolute top-3 right-3 text-gray-500 hover:text-white"><X size={20} /></button>
                </div>
                <div className="p-4 overflow-y-auto flex-grow custom-scrollbar">
                    <h3 className="font-bold mb-3 text-white">Check-in Log</h3>
                    <div className="flex flex-col gap-4">
                        {goalPosts.length > 0 ? (
                            goalPosts.map(post => <PostCard key={post.id} post={post} />)
                        ) : (
                            <p className="text-sm text-center text-gray-500 py-4">No check-ins have been logged for this vow yet.</p>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};