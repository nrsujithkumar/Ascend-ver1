import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { User } from 'firebase/auth';
import { useDatabase } from './contexts/DatabaseContext';

// Import all pages
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { HomePage } from './pages/dashboard/HomePage';
import { ClanPage } from './pages/dashboard/ClanPage';
import { CreatePage } from './pages/dashboard/CreatePage';
import { SearchPage } from './pages/dashboard/SearchPage';
import { AlertsPage } from './pages/dashboard/AlertsPage';
import { ProfilePage } from './pages/dashboard/ProfilePage';

import { Preloader } from './components/Preloader';

// This wrapper component contains all our app's logic and hooks
const AppContent = () => {
    const { currentUser, userProfile, loading, saveUserProfile } = useDatabase();
    const [isPreloaderVisible, setIsPreloaderVisible] = useState(true);

    const [onboardingStep, setOnboardingStep] = useState(1);
    const [onboardingData, setOnboardingData] = useState<any>({});
    const ONBOARDING_STEP_COUNT = 6;

    const navigate = useNavigate();

    // This effect handles all automatic navigation
    useEffect(() => {
        if (!loading && !isPreloaderVisible) {
            if (currentUser && userProfile) {
                if (!window.location.pathname.startsWith('/dashboard')) {
                    navigate('/dashboard', { replace: true });
                }
            } else if (currentUser && !userProfile) {
                navigate('/onboarding', { replace: true });
            }
        }
    }, [currentUser, userProfile, loading, isPreloaderVisible, navigate]);

    const handlePreloaderComplete = () => setIsPreloaderVisible(false);

    const handleSignupSuccess = (user: User, fullName: string) => {
        setOnboardingData({
            fullName, username: '', mantra: '', vibe: '',
            avatar: '', goal: '', privacyMode: 'Public',
        });
        setOnboardingStep(1);
        navigate('/onboarding', { replace: true });
    };
    
    // Onboarding handlers
    const updateOnboardingData = (newData: any) => setOnboardingData((prev: any) => ({ ...prev, ...newData }));
    const handleNextOnboardingStep = () => {
        if (onboardingStep < ONBOARDING_STEP_COUNT) setOnboardingStep(p => p + 1);
        else handleProfileSetupComplete();
    };
    const handlePrevOnboardingStep = () => { if (onboardingStep > 1) setOnboardingStep(p => p - 1); else navigate('/'); };
    const handleProfileSetupComplete = async () => {
        try { await saveUserProfile(onboardingData); }
        catch (error) { console.error("Error saving profile:", error); }
    };

    if (isPreloaderVisible) {
        return (
            <div className="fixed inset-0 bg-white dark:bg-[#0a0a0a] z-[100] flex items-center justify-center">
                <Preloader onComplete={handlePreloaderComplete} />
            </div>
        );
    }

    return (
        <>
            <div id="recaptcha-container"></div>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<AuthPage onSignupSuccess={handleSignupSuccess} />} />

                {/* Onboarding Route (requires login) */}
                <Route path="/onboarding" element={currentUser ? <OnboardingPage
                    currentStep={onboardingStep}
                    onNext={handleNextOnboardingStep}
                    onBack={handlePrevOnboardingStep}
                    onboardingData={onboardingData}
                    updateOnboardingData={updateOnboardingData}
                    completeOnboarding={handleProfileSetupComplete}
                    totalSteps={ONBOARDING_STEP_COUNT}
                /> : <Navigate to="/auth" replace />} />

                {/* Dashboard Routes (requires login AND profile) */}
                <Route path="/dashboard" element={currentUser && userProfile ? <DashboardPage /> : <Navigate to="/" replace />}>
                    <Route index element={<HomePage />} />
                    <Route path="clan" element={<ClanPage />} />
                    <Route path="create" element={<CreatePage />} />
                    <Route path="search" element={<SearchPage />} />
                    <Route path="alerts" element={<AlertsPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="profile/:userId" element={<ProfilePage />} />
                </Route>
                
                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
};

// The main App component's only job is to provide the Router
function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;