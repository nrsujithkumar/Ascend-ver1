import React from 'react';
import { Link } from 'react-router-dom';
import { useDatabase } from '../../contexts/DatabaseContext';
import { GoalCard } from '../../components/dashboard/GoalCard';
import { PostCard } from '../../components/dashboard/PostCard';
import { AVATAR_MAP } from '../../components/avatars';

const CreateTrigger = () => {
    const { userProfile } = useDatabase();
    if (!userProfile) return null;
    const AvatarComponent = userProfile.avatar ? AVATAR_MAP[userProfile.avatar as keyof typeof AVATAR_MAP] : null;

    return (
        <Link to="/dashboard/create" className="bg-white/5 dark:bg-black/10 p-4 rounded-2xl border border-gray-200/50 dark:border-white/10 hover:bg-black/20 cursor-pointer transition-colors block no-underline">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 text-sky-400 flex-shrink-0">
                    {AvatarComponent && <AvatarComponent isSelected />}
                </div>
                <p className="text-gray-500">What did you achieve today, {userProfile.username}?</p>
            </div>
        </Link>
    );
};

export const HomePage = () => {
    const { userProfile, userGoals, feedPosts } = useDatabase();
    if (!userProfile) return null;

    return (
        <div className="w-full max-w-3xl mx-auto flex-grow flex flex-col gap-6">
            <div><h1 className="text-3xl font-bold text-white">Welcome back, {userProfile.fullName.split(' ')[0]}!</h1></div>
            <div className="bg-white/5 dark:bg-black/10 p-4 rounded-2xl border border-gray-200/50 dark:border-white/10">
                <h2 className="font-bold mb-3 text-white">Your Daily Vows</h2>
                {userGoals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {userGoals.map((goal) => <GoalCard key={goal.id} goal={goal} />)}
                    </div>
                ) : (
                    <p className="text-sm text-center text-gray-500 py-4">You haven't set any vows yet. <Link to="/dashboard/create" className="text-sky-400 font-bold">Create one!</Link></p>
                )}
            </div>
            <CreateTrigger />
            <div className="flex-grow">
                <h2 className="font-bold text-lg text-white my-4">Your Feed</h2>
                <div className="space-y-4">
                    {feedPosts.length > 0 ? (
                        feedPosts.map(post => <PostCard key={post.id} post={post} />)
                     ) : (
                        <div className="text-center text-gray-500 text-sm py-10">
                            Your feed is empty. Check-in to a vow or follow someone to see posts.
                        </div>
                     )}
                </div>
            </div>
        </div>
    );
};