import React, { useState, useRef, ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';

// Layout
import { LandingHeader } from '../components/layout/LandingHeader';
import { Footer } from '../components/layout/Footer';

// Page Sections
import { IntroductionSection } from '../components/landing/IntroductionSection';
import { CoreFeaturesSection } from '../components/landing/CoreFeaturesSection';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { AboutUsSection } from '../components/landing/AboutUsSection';
import { CTASection } from '../components/landing/CTASection';

// Modals
import { LegalModal } from '../components/legal/LegalModal';
import { TermsContent } from '../components/legal/TermsContent';
import { PrivacyPolicyContent } from '../components/legal/PrivacyPolicyContent';

// Utilities
import { CursorBlob } from '../components/ui/CursorBlob';

// No props are needed for this component anymore
export const LandingPage = () => {
    const mouse = useRef({ x: 0, y: 0 });
    const [legalModalContent, setLegalModalContent] = useState<{title: string, content: ReactNode} | null>(null);

    const handleOpenLegalModal = (type: 'terms' | 'privacy') => {
        if (type === 'terms') {
            setLegalModalContent({ title: 'Terms of Service', content: <TermsContent /> });
        } else {
            setLegalModalContent({ title: 'Privacy Policy', content: <PrivacyPolicyContent /> });
        }
    };

    const handleCloseLegalModal = () => setLegalModalContent(null);

    return (
        <div className="bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-gray-100 font-sans antialiased overflow-x-hidden">
            <div className="aurora-bg"></div>
            <CursorBlob mouse={mouse}/>
            <div className="relative z-10">
                <LandingHeader />
                <main>
                    <IntroductionSection />
                    <CoreFeaturesSection />
                    <HowItWorksSection />
                    <AboutUsSection />
                    {/* The onBeginAscent prop is no longer needed here */}
                    <CTASection />
                 </main>
                <Footer onOpenLegalModal={handleOpenLegalModal} />
            </div>
            <AnimatePresence>
                {legalModalContent && <LegalModal title={legalModalContent.title} content={legalModalContent.content} onClose={handleCloseLegalModal} />}
            </AnimatePresence>
        </div>
    );
};