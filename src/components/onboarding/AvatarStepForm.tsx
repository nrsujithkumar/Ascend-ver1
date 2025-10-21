import React from 'react';
import { motion } from 'framer-motion';
import { AVATAR_MAP } from '../avatars'; // Import our avatar map

interface AvatarStepProps {
    onNext: () => void;
    onBack: () => void;
    data: any;
    updateData: (data: any) => void;
}

export const AvatarStepForm = ({ onNext, onBack, data, updateData }: AvatarStepProps) => {
    const { avatar: selectedAvatar } = data;
    // Get the avatar names from our map
    const avatars = Object.keys(AVATAR_MAP);

    return (
        <div>
            <p className="text-center text-sky-400/80 mb-8">Choose a Symbol of Your Ascent</p>
            <div className="grid grid-cols-5 gap-4">
                {avatars.map(avatarName => {
                    // Get the component from the map
                    const AvatarComponent = AVATAR_MAP[avatarName as keyof typeof AVATAR_MAP];
                    const isSelected = selectedAvatar === avatarName;
                    
                    return (
                        <motion.div
                            key={avatarName}
                            onClick={() => updateData({ avatar: avatarName })}
                            className={`flex flex-col items-center justify-center aspect-square rounded-lg cursor-pointer border-2 transition-all p-2 ${isSelected ? 'border-sky-500 bg-sky-500/10 shadow-lg' : 'border-gray-300/50 dark:border-gray-700/50 hover:border-sky-400/50 hover:bg-sky-500/5'}`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                           <div className={`w-8 h-8 transition-colors ${isSelected ? 'text-sky-500' : 'text-gray-600 dark:text-gray-400'}`}>
                                <AvatarComponent isSelected={isSelected} />
                           </div>
                           <span className={`text-xs mt-2 font-semibold transition-colors ${isSelected ? 'text-sky-500' : 'text-gray-500'}`}>
                               {avatarName}
                           </span>
                        </motion.div>
                    )
                })}
            </div>
            
             <div className="flex justify-between items-center pt-8">
                <motion.button type="button" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onBack} className="px-6 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-3 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors">
                    Back
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onNext}
                    className="px-8 bg-sky-500 text-white font-bold py-3 rounded-lg hover:bg-sky-600 transition-colors shadow-lg shadow-sky-500/20 disabled:bg-gray-500 disabled:shadow-none disabled:cursor-not-allowed"
                    disabled={!selectedAvatar}
                >
                    Next
                </motion.button>
            </div>
        </div>
    );
};