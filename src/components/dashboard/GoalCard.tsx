// Filename: src/components/dashboard/GoalCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Target, Check } from 'lucide-react';
import { Goal } from '../../contexts/DatabaseContext';
import { useModal } from '../../contexts/ModalContext';
import { GoalDetailModal } from './GoalDetailModal';
import { useDatabase } from '../../contexts/DatabaseContext';

export const GoalCard = ({ goal }: { goal: Goal }) => {
    const { showModal, addCheckIn } = useDatabase(); // Note: useDatabase provides addCheckIn
    const { showModal: openModal } = useModal();

    const openGoalModal = () => openModal(<GoalDetailModal goal={goal} />);

    const handleCheckIn = (e: React.MouseEvent) => {
        e.stopPropagation();
        const checkInMessage = `Checked in for my vow: "${goal.title}"`;
        addCheckIn(goal.id, checkInMessage).catch(err => console.error("Check-in failed:", err));
    };

    return (
        <div onClick={openGoalModal} className="bg-black/20 p-3 rounded-lg flex items-center gap-3 cursor-pointer hover:bg-black/30 transition-colors">
            <div className="w-8 h-8 flex-shrink-0 bg-sky-500/20 text-sky-400 rounded-lg flex items-center justify-center"><Target size={20} /></div>
            <div>
                <h4 className="font-bold text-sm text-white">{goal.title}</h4>
                <p className="text-xs text-gray-400">Checked in {goal.checkIns?.length || 0} times</p>
            </div>
            <motion.button onClick={handleCheckIn} whileHover={{scale: 1.1}} whileTap={{scale: 0.9}} className="ml-auto w-8 h-8 flex-shrink-0 bg-green-500/20 text-green-300 rounded-full flex items-center justify-center hover:bg-green-500/30">
                <Check size={18}/>
            </motion.button>
        </div>
    );
};