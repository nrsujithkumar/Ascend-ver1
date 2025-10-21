// Filename: src/components/dashboard/CreateVowForm.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from '../../contexts/DatabaseContext';

export const CreateVowForm = () => {
    const { createGoal } = useDatabase();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleCreateGoal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim()) { setError("Please fill out all fields."); return; }
        if (isSubmitting) return;
        setIsSubmitting(true);
        setError('');
        try {
            await createGoal({ title, description, isPublic });
            navigate('/dashboard');
        } catch (err) {
            console.error("Failed to create goal:", err);
            setError("Could not create vow. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-bold text-white mb-6">Create a New Vow</h2>
            <form onSubmit={handleCreateGoal} className="space-y-4">
                <div>
                    <label htmlFor="goalTitle" className="block text-sm font-medium text-gray-300 mb-1">Vow / Goal Title</label>
                    <input id="goalTitle" value={title} onChange={e => setTitle(e.target.value)} type="text" placeholder="e.g., Daily Workout" className="w-full px-3 py-2 text-sm text-white bg-gray-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                </div>
                <div>
                    <label htmlFor="goalDesc" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                    <textarea id="goalDesc" value={description} onChange={e => setDescription(e.target.value)} placeholder="What's the mission? e.g., Go to the gym for 45 minutes." rows={3} className="w-full px-3 py-2 text-sm text-white bg-gray-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-300">Visibility</span>
                    <div className="flex p-1 bg-gray-800/50 rounded-full">
                        <button type="button" onClick={() => setIsPublic(true)} className={`relative px-4 py-1 text-xs font-semibold rounded-full z-10 ${isPublic ? 'text-white' : 'text-gray-400'}`}>Public {isPublic && <motion.div layoutId="vis-indicator" className="absolute inset-0 bg-sky-500 rounded-full -z-10" />}</button>
                        <button type="button" onClick={() => setIsPublic(false)} className={`relative px-4 py-1 text-xs font-semibold rounded-full z-10 ${!isPublic ? 'text-white' : 'text-gray-400'}`}>Private {!isPublic && <motion.div layoutId="vis-indicator" className="absolute inset-0 bg-sky-500 rounded-full -z-10" />}</button>
                    </div>
                </div>
                {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                <motion.button type="submit" whileHover={{scale: 1.03}} whileTap={{scale: 0.97}} disabled={isSubmitting} className="w-full bg-sky-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-600 disabled:bg-gray-500">
                    {isSubmitting ? 'Creating...' : 'Create Vow'}
                </motion.button>
            </form>
        </motion.div>
    );
};