import React from 'react';
import { Link } from 'react-router-dom';
import { useDatabase } from '../../contexts/DatabaseContext'; // Import our context hook
import { GoalCard } from '../../components/dashboard/GoalCard'; // Import the GoalCard
import { AVATAR_MAP } from '../../components/avatars';

// A simple trigger component that links to the Create page
const CreatePostTrigger = () => {
    const { userProfile } = useDatabase();
    if (!userProfile) return null;
    const AvatarComponent = userProfile.avatar ? AVATAR_MAP[userProfile.avatar as keyof typeof AVATAR_MAP] : null;

    return (
        <Link to="/dashboard/create" className="bg-white/5 dark:bg-black/10 p-4 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:bg-black/20 cursor-pointer transition-colors block">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 text-sky-400 flex-shrink-0">
                    {AvatarComponent && <AvatarComponent />}
                </div>
                <p className="text-gray-500">What's your vow for today, {userProfile.username}?</p>
            </div>
        </Link>
    );
};

export const HomePage = () => {
    const { userProfile, userGoals } = useDatabase(); // Get profile and goals from context

    // Welcome quotes
    const quotes = [ "The secret of getting ahead is getting started.", "The journey of a thousand miles begins with a single step.", "Success is the sum of small efforts, repeated day in and day out." ];
    const [quote] = React.useState(quotes[Math.floor(Math.random() * quotes.length)]);

    if (!userProfile) return null; // Should not happen if routed correctly

    return (
        <div className="w-full max-w-3xl mx-auto flex-grow flex flex-col gap-6">
            {/* Welcome Message */}
            <div>
                <h1 className="text-3xl font-bold text-white">Welcome back, {userProfile.fullName.split(' ')[0]}!</h1>
                <p className="text-gray-400 italic mt-1">"{quote}"</p>
            </div>

            {/* Daily Vows Section */}
            <div className="bg-white/5 dark:bg-black/10 p-4 rounded-2xl border border-gray-200/50 dark:border-white/10">
                <h2 className="font-bold mb-3 text-white">Your Daily Vows</h2>
                {userGoals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Map over the goals from the context and render a GoalCard for each */}
                        {userGoals.map((goal) => <GoalCard key={goal.id} goal={goal} />)}
                    </div>
                ) : (
                    <p className="text-sm text-center text-gray-500 py-4">You haven't set any vows yet. Tap below to start your journey!</p>
                )}
            </div>

            {/* Create Post/Vow Trigger */}
            <CreatePostTrigger />

            {/* Feed Section (Placeholder) */}
            <div className="overflow-y-auto custom-scrollbar flex-grow pr-2 -mr-2">
                <div className="flex flex-col gap-4">
                     <h2 className="font-bold text-lg text-white">Your Feed</h2>
                     <div className="h-full flex items-center justify-center text-gray-500 text-sm py-10">
                        Posts from you and your clan will appear here. (Coming Soon)
                     </div>
                </div>
            </div>
        </div>
    );
};