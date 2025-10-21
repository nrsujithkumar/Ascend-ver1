import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // Import useParams and Link
import { motion } from 'framer-motion';
import { Flame, User as UserIcon } from 'lucide-react';
import { useDatabase, UserProfile } from '../../contexts/DatabaseContext';
import { AVATAR_MAP } from '../../components/avatars';
import { LineChart } from '../../components/dashboard/LineChart';
import { GoalCard } from '../../components/dashboard/GoalCard';
import { PostCard } from '../../components/dashboard/PostCard';
import { useModal } from '../../contexts/ModalContext';
import { EditProfileModal } from '../../pages/dashboard/EditProfileModal';
import { AchievementIcon } from '../../pages/dashboard/AchievementIcon';
import { UserListModal } from '../../components/dashboard/UserListModal';
import { db } from '../../firebase';
import { collection, query, where, onSnapshot, Timestamp } from 'firebase/firestore';

// Helper functions (no changes)
const generateProgressData = (history?: Timestamp[]): { day: string; value: number }[] => {
    const days=['S','M','T','W','T','F','S'];const today=new Date();today.setHours(0,0,0,0);const weeklyCheckins=Array(7).fill(0);if(history){history.forEach(ts=>{const d=ts.toDate(),t=today.getTime()-d.getTime(),D=Math.floor(t/(864e5));if(D>=0&&D<7){const i=(today.getDay()-D+7)%7;weeklyCheckins[i]++;}})}let data=[];for(let i=0;i<7;i++){const dayIndex=(today.getDay()-(6-i)+7)%7;const value=Math.min(weeklyCheckins[dayIndex]*100,100);data.push({day:days[dayIndex],value});}return data;
};
const getGlowStyle = (streak: number) => {
    const i=Math.min(streak/30,1),c=`rgba(255,150,50,${i*.7})`,b=Math.max(5,i*30),s=Math.max(2,i*12);return{boxShadow:`0 0 ${b}px ${s}px ${c}`};
};
const ALL_ACHIEVEMENTS = [
    { id: 'firstVow', name: 'First Vow', icon: '🌅', description: 'Create your first vow.', unlocked: (p: UserProfile, f: number) => (p.goalIds?.length || 0) > 0 },
    { id: 'streak7', name: '7-Day Streak', icon: '🔥', description: 'Maintain a 7-day streak.', unlocked: (p: UserProfile, f: number) => p.streak >= 7 },
    { id: 'follower10', name: 'Community Pillar', icon: '🤝', description: 'Get 10 followers.', unlocked: (p: UserProfile, f: number) => f >= 10 },
    { id: 'streak30', name: '30-Day Discipline', icon: '👑', description: 'Maintain a 30-day streak.', unlocked: (p: UserProfile, f: number) => p.streak >= 30 },
];

export const ProfilePage = () => {
    const { userId } = useParams(); // Get user ID from the URL, e.g., /profile/some_user_id
    const { userProfile: ownProfile, getUser, followUser, unfollowUser, feedPosts } = useDatabase();
    const { showModal } = useModal();
    
    const [viewedProfile, setViewedProfile] = useState<UserProfile | null>(null);
    const [viewedGoals, setViewedGoals] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [followerCount, setFollowerCount] = useState(0);
    const [followers, setFollowers] = useState<string[]>([]);

    useEffect(() => {
        const loadProfile = async () => {
            setIsLoading(true);
            if (userId) {
                const profile = await getUser(userId);
                setViewedProfile(profile);
            } else {
                setViewedProfile(ownProfile);
            }
            setIsLoading(false);
        };
        loadProfile();
    }, [userId, ownProfile, getUser]);

    useEffect(() => {
        if (!viewedProfile?.goalIds || viewedProfile.goalIds.length === 0) {
            setViewedGoals([]);
            return;
        }
        const goalsQuery = query(collection(db, 'goals'), where('__name__', 'in', viewedProfile.goalIds));
        const unsubscribe = onSnapshot(goalsQuery, (snapshot) => {
            setViewedGoals(snapshot.docs.map(g => ({ id: g.id, ...g.data() })));
        });
        return () => unsubscribe();
    }, [viewedProfile]);
    
    useEffect(() => {
        if (!viewedProfile) return;
        const followersQuery = query(collection(db, "users"), where("following", "array-contains", viewedProfile.uid));
        const unsubscribe = onSnapshot(followersQuery, (snapshot) => {
            setFollowerCount(snapshot.size);
            setFollowers(snapshot.docs.map(doc => doc.id));
        });
        return () => unsubscribe();
    }, [viewedProfile]);

    if (isLoading || !viewedProfile) {
        return <div className="text-center text-white p-10">Loading Profile...</div>;
    }

    const isOwnProfile = viewedProfile.uid === ownProfile?.uid;
    const isFollowing = ownProfile?.following?.includes(viewedProfile.uid);
    const { avatar, username, mantra, vibe, fullName, streak, following, checkInHistory } = viewedProfile;
    const AvatarComponent = avatar ? AVATAR_MAP[avatar as keyof typeof AVATAR_MAP] : null;
    const followingCount = following?.length || 0;
    const goalsCreatedCount = viewedProfile.goalIds?.length || 0;
    const progressData = generateProgressData(checkInHistory);
    const userPosts = feedPosts.filter(p => p.userId === viewedProfile.uid);

    const handleToggleFollow = () => {
        if (isFollowing) { unfollowUser(viewedProfile.uid); }
        else { followUser(viewedProfile.uid); }
    };

    const openEditModal = () => showModal(<EditProfileModal />);
    const openFollowersModal = () => showModal(<UserListModal title="Followers" userIds={followers} />);
    const openFollowingModal = () => showModal(<UserListModal title="Following" userIds={following || []} />);
    const panelVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
    const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

    return (
        <div className="w-full flex-grow flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-1/3 bg-white/5 dark:bg-black/10 p-6 rounded-2xl border border-gray-200/50 dark:border-white/10 flex flex-col">
                <motion.div className="flex flex-col items-center text-center flex-grow" variants={panelVariants} initial="hidden" animate="visible">
                    <motion.div variants={itemVariants} className="relative w-24 h-24 mb-4">
                        <div className="w-full h-full text-sky-400">{AvatarComponent ? <AvatarComponent isSelected /> : <UserIcon />}</div>
                        {vibe && <div className="absolute -bottom-1 -right-1 bg-gray-800 p-1.5 rounded-full text-lg border-2 border-black/20 group cursor-pointer">{ { 'The Hustler': '🔥', 'The Seeker': '🌿', 'The Creator': '⚡', 'The Dreamer': '🌙', 'The Monk': '🧘' }[vibe]}<div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded-md">{vibe}</div></div>}
                    </motion.div>
                    <motion.h1 variants={itemVariants} className="text-2xl font-bold text-white">{fullName}</motion.h1>
                    <motion.h2 variants={itemVariants} className="text-md text-sky-400">@{username}</motion.h2>
                    <motion.p variants={itemVariants} className="text-sm text-gray-400 mt-2 italic max-w-xs">"{mantra}"</motion.p>
                    
                    {!isOwnProfile ? (
                        <motion.button onClick={handleToggleFollow} variants={itemVariants} className={`relative text-sm py-2 px-6 mt-6 rounded-full border-2 transition-colors ${isFollowing ? 'bg-white/10 text-white' : 'bg-sky-500 text-white'}`}>
                            {isFollowing ? 'Following' : 'Follow'}
                        </motion.button>
                    ) : (
                        <motion.button onClick={openEditModal} variants={itemVariants} className="cta-button relative text-sm py-2 px-6 mt-6 rounded-full border-2 bg-white/10 hover:bg-white/20">
                            Edit Profile
                        </motion.button>
                    )}

                    <motion.div variants={itemVariants} className="flex gap-6 mt-6 text-sm">
                        <div onClick={openFollowersModal} className="text-center hover:text-sky-400 transition-colors cursor-pointer"><span className="font-bold text-white">{followerCount}</span><span className="text-gray-400"> Followers</span></div>
                        <div onClick={openFollowingModal} className="text-center hover:text-sky-400 transition-colors cursor-pointer"><span className="font-bold text-white">{followingCount}</span><span className="text-gray-400"> Following</span></div>
                    </motion.div>
                    <motion.div variants={itemVariants} className="flex justify-around w-full my-8 py-4 border-y border-white/10">
                        <div className="text-center"><p className="text-2xl font-bold text-white">{goalsCreatedCount}</p><p className="text-xs text-gray-500 uppercase">Vows Created</p></div>
                        <div className="text-center"><p className="text-2xl font-bold text-white">0</p><p className="text-xs text-gray-500 uppercase">Vows Completed</p></div>
                    </motion.div>
                </motion.div>
                <motion.div className="flex flex-col items-center mt-auto" variants={itemVariants}>
                     <motion.div className="p-4 rounded-full" style={getGlowStyle(streak)} animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2.5, repeat: Infinity }}>
                        <Flame size={48} className="text-orange-400" />
                     </motion.div>
                     <p className="text-center font-bold text-lg mt-2 text-white">{streak} Day Streak</p>
                </motion.div>
            </div>
            <div className="w-full lg:w-2/3 flex flex-col gap-6">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10"><h3 className="font-bold text-white mb-2">Weekly Progress</h3><LineChart data={progressData} /></div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <h3 className="font-bold text-white mb-3">{isOwnProfile ? "Your Vows" : `${username}'s Vows`}</h3>
                    {viewedGoals.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {viewedGoals.map(goal => <GoalCard key={goal.id} goal={goal as any} />)}
                        </div>
                    ) : (<p className="text-sm text-center text-gray-500 py-4">No vows created yet.</p>)}
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <h3 className="font-bold text-white mb-3">Achievements</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {ALL_ACHIEVEMENTS.map(ach => (
                            <AchievementIcon key={ach.id} name={ach.name} description={ach.description} icon={ach.icon} unlocked={ach.unlocked(viewedProfile, followerCount)} />
                        ))}
                    </div>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex-grow flex flex-col">
                    <h3 className="font-bold text-white mb-2">User Feed</h3>
                    <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 -mr-2">
                        {userPosts.length > 0 ? (
                            <div className="space-y-4">{userPosts.map(post => <PostCard key={post.id} post={post} />)}</div>
                        ) : (<div className="h-full flex items-center justify-center"><span className="text-gray-500 text-sm">No posts yet.</span></div>)}
                    </div>
                </div>
            </div>
        </div>
    );
};