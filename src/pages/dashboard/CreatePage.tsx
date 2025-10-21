import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit3 } from 'lucide-react';
import { CreateVowForm } from '../../components/dashboard/CreateVowForm';
import { CreatePostForm } from '../../components/dashboard/CreatePostForm';
import { useDatabase } from '../../contexts/DatabaseContext';

type CreateView = 'chooser' | 'new_vow' | 'log_post';

export const CreatePage = () => {
    const [view, setView] = useState<CreateView>('chooser');
    const { userGoals } = useDatabase();

    const Chooser = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-white text-center mb-4">What would you like to do?</h2>
            <motion.div onClick={() => setView('new_vow')} whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} className="bg-white/5 p-6 rounded-lg text-center cursor-pointer border border-transparent">
                <Plus className="mx-auto w-10 h-10 text-sky-400 mb-2" />
                <h3 className="font-bold text-white">Create a New Vow</h3>
                <p className="text-sm text-gray-400">Start a new goal or habit.</p>
            </motion.div>
            {userGoals.length > 0 && (
                <motion.div onClick={() => setView('log_post')} whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} className="bg-white/5 p-6 rounded-lg text-center cursor-pointer border border-transparent">
                    <Edit3 className="mx-auto w-10 h-10 text-green-400 mb-2" />
                    <h3 className="font-bold text-white">Log a Check-in</h3>
                    <p className="text-sm text-gray-400">Post an update for an existing vow.</p>
                </motion.div>
            )}
        </motion.div>
    );

    return (
        <div className="w-full max-w-2xl mx-auto flex-grow flex flex-col justify-center">
            {view === 'chooser' && <Chooser />}
            {view === 'new_vow' && <CreateVowForm />}
            {view === 'log_post' && <CreatePostForm />}
        </div>
    );
};