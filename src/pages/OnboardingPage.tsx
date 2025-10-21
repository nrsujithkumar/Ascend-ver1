import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CursorBlob } from '../components/ui/CursorBlob';

// Import all the step components
import { IdentityStepForm } from '../components/onboarding/IndentityStepForm';
import { VibeStepForm } from '../components/onboarding/VibeStepForm';
import { AvatarStepForm } from '../components/onboarding/AvatarStepForm';
import { GoalStepForm } from '../components/onboarding/GoalStepForm';
import { PrivacyStepForm } from '../components/onboarding/PrivacyStepForm';
import { CrownRevealStep } from '../components/onboarding/CrownRevealStep';

// Define the props our page will accept from App.tsx
interface OnboardingPageProps {
    currentStep: number;
    onNext: () => void;
    onBack: () => void;
    goToStep: (step: number) => void;
    onboardingData: any;
    updateOnboardingData: (data: any) => void;
    completeOnboarding: () => void;
    totalSteps: number;
}

export const OnboardingPage = (props: OnboardingPageProps) => {
    const mouse = React.useRef({ x: 0, y: 0 });
    const [direction, setDirection] = useState(1); // For slide animation

    const handleNext = () => {
        setDirection(1);
        props.onNext();
    };

    const handleBack = () => {
        setDirection(-1);
        props.onBack();
    };

    const handleGoToStep = (step: number) => {
        setDirection(step < props.currentStep ? -1 : 1);
        props.goToStep(step);
    }
    
    // Animation variants for sliding
    const variants = {
        enter: (direction: number) => ({ opacity: 0, x: direction * 50 }),
        center: { opacity: 1, x: 0 },
        exit: (direction: number) => ({ opacity: 0, x: direction * -50 }),
    };

    return (
        <div className="bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 font-sans antialiased overflow-hidden min-h-screen">
            <div className="aurora-bg"></div>
            <CursorBlob mouse={mouse}/>
            <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="relative w-full max-w-lg bg-white/50 dark:bg-[#101010]/50 backdrop-blur-2xl border border-gray-200/50 dark:border-white/10 rounded-2xl shadow-2xl p-8 overflow-hidden"
                >
                     {/* Show title only on steps before the reveal */}
                     {props.currentStep < props.totalSteps && (
                         <>
                             <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
                                 Build Your Identity
                            </h2>
                         </>
                    )}
 
                     <div className={`relative ${props.currentStep < props.totalSteps ? 'mt-8' : ''} min-h-[400px]`}>
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={props.currentStep}
                                 custom={direction}
                                variants={variants}
                                initial="enter"
                                 animate="center"
                                exit="exit"
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                            >
                                {/* Render the correct step component based on currentStep */}
                                {props.currentStep === 1 && <IdentityStepForm onNext={handleNext} data={props.onboardingData} updateData={props.updateOnboardingData} isFirstStep={true} />}
                                {props.currentStep === 2 && <VibeStepForm onNext={handleNext} onBack={handleBack} data={props.onboardingData} updateData={props.updateOnboardingData} />}
                                {props.currentStep === 3 && <AvatarStepForm onNext={handleNext} onBack={handleBack} data={props.onboardingData} updateData={props.updateOnboardingData} />}
                                {props.currentStep === 4 && <GoalStepForm onNext={handleNext} onBack={handleBack} data={props.onboardingData} updateData={props.updateOnboardingData} />}
                                {props.currentStep === 5 && <PrivacyStepForm onNext={handleNext} onBack={handleBack} data={props.onboardingData} updateData={props.updateOnboardingData} />}
                                {props.currentStep === 6 && <CrownRevealStep onFinish={props.completeOnboarding} data={props.onboardingData} />}
                            </motion.div>
                         </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};