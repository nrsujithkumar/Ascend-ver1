import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useModal } from '../../contexts/ModalContext';
import { useDatabase } from '../../contexts/DatabaseContext';

export const EditProfileModal = () => {
    const { hideModal } = useModal();
    const { userProfile, updateUserProfile } = useDatabase();

    const [fullName, setFullName] = useState(userProfile?.fullName || '');
    const [mantra, setMantra] = useState(userProfile?.mantra || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName.trim() || !mantra.trim()) {
            setError("Fields cannot be empty.");
            return;
        }
        setIsSubmitting(true);
        setError('');
        try {
            await updateUserProfile({ fullName, mantra });
            hideModal();
        } catch (err) {
            console.error("Failed to update profile:", err);
            setError("An error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={hideModal}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="bg-gray-900/80 border border-white/10 rounded-2xl w-full max-w-md flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 border-b border-white/10">
                    <h2 className="text-lg font-bold text-white text-center">Edit Profile</h2>
                    <button onClick={hideModal} className="absolute top-3 right-3 text-gray-500 hover:text-white"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                        <input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} type="text" className="w-full px-3 py-2 text-sm text-white bg-gray-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
                    </div>
                    <div>
                        <label htmlFor="mantra" className="block text-sm font-medium text-gray-300 mb-1">Mantra</label>
                        <textarea id="mantra" value={mantra} onChange={(e) => setMantra(e.target.value)} rows={2} className="w-full px-3 py-2 text-sm text-white bg-gray-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
                    </div>
                    {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                    <motion.button type="submit" disabled={isSubmitting} className="w-full bg-sky-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-sky-600 disabled:bg-gray-500" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </motion.button>
                </form>
            </motion.div>
        </motion.div>
    );
};