// Filename: src/components/dashboard/CreatePostForm.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDatabase } from '../../contexts/DatabaseContext';

export const CreatePostForm = () => {
    const { userGoals, addCheckIn } = useDatabase();
    const navigate = useNavigate();
    const [selectedGoal, setSelectedGoal] = useState(userGoals[0]?.id || '');
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedGoal) { setError("Please select a vow to check in for."); return; }
        if (!content.trim()) { setError("Please write an update for your check-in."); return; }
        
        setIsSubmitting(true);
        setError('');
        try {
            await addCheckIn(selectedGoal, content);
            navigate('/dashboard');
        } catch (err) {
            console.error("Failed to log check-in:", err);
            setError("Could not post check-in. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (userGoals.length === 0) {
        return (
            <div className="text-center">
                <h3 className="text-white">You need to create a vow before you can log a check-in.</h3>
            </div>
        )
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-2xl font-bold text-white mb-6">Log a Check-in</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="goalSelect" className="block text-sm font-medium text-gray-300 mb-1">Which vow are you checking in for?</label>
                    <select id="goalSelect" value={selectedGoal} onChange={(e) => setSelectedGoal(e.target.value)} className="w-full px-3 py-2 text-sm text-white bg-gray-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
                        {userGoals.map(goal => (
                            <option key={goal.id} value={goal.id}>{goal.title}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="postContent" className="block text-sm font-medium text-gray-300 mb-1">Update / Note</label>
                    <textarea id="postContent" value={content} onChange={(e) => setContent(e.target.value)} placeholder="What progress did you make today?" rows={4} className="w-full px-3 py-2 text-sm text-white bg-gray-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                </div>
                {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                <motion.button type="submit" disabled={isSubmitting} className="w-full bg-sky-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-sky-600 disabled:bg-gray-500">
                    {isSubmitting ? 'Posting...' : 'Post Check-in'}
                </motion.button>
            </form>
        </motion.div>
    );
};