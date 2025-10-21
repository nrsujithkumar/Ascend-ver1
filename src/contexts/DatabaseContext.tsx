import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs, addDoc, Timestamp, updateDoc, arrayUnion, onSnapshot, orderBy, arrayRemove } from 'firebase/firestore';

// --- DATA STRUCTURES (Notification is new) ---
export interface Notification { id: string; fromUserId: string; type: 'follow' | 'like' | 'comment'; postId?: string; read: boolean; timestamp: Timestamp; }
export interface Clan { id: string; name: string; description: string; members: string[]; }
export interface ChatMessage { id: string; userId: string; username: string; avatar: string; text: string; timestamp: Timestamp; }
export interface Comment { userId: string; username: string; avatar: string; content: string; timestamp: Timestamp; }
export interface Post { id: string; userId: string; content: string; type: 'update' | 'win' | 'goal_checkin'; goalId?: string; timestamp: Timestamp; likes: string[]; comments: Comment[]; }
export interface Goal { id: string; userId: string; title: string; description: string; isPublic: boolean; createdAt: Timestamp; lastCheckIn?: Timestamp; checkIns: Timestamp[]; }
export interface UserProfile { uid: string; email: string | null; phone: string | null; fullName: string; username: string; mantra: string; vibe: string; avatar: string; privacyMode: 'Public' | 'Private'; joinedAt: string; streak: number; goalIds?: string[]; following?: string[]; checkInHistory?: Timestamp[]; }

// --- CONTEXT DEFINITION (notifications and new function are added) ---
interface DatabaseContextProps {
    currentUser: User | null; userProfile: UserProfile | null; userGoals: Goal[]; feedPosts: Post[];
    allUsers: UserProfile[]; clans: Clan[]; notifications: Notification[]; loading: boolean;
    clanChat: (clanId: string) => ChatMessage[];
    checkUsernameUnique: (username: string) => Promise<boolean>;
    saveUserProfile: (profileData: any) => Promise<void>;
    createGoal: (goalData: { title: string, description: string, isPublic: boolean }) => Promise<void>;
    getUser: (userId: string) => Promise<UserProfile | null>;
    updateUserProfile: (data: { fullName?: string; mantra?: string; }) => Promise<void>;
    addCheckIn: (goalId: string, postContent: string) => Promise<void>;
    toggleLike: (postId: string) => Promise<void>;
    addComment: (postId: string, commentText: string) => Promise<void>;
    followUser: (userIdToFollow: string) => Promise<void>;
    unfollowUser: (userIdToUnfollow: string) => Promise<void>;
    sendChatMessage: (clanId: string, text: string) => Promise<void>;
    joinClan: (clanId: string) => Promise<void>;
    markNotificationsAsRead: () => Promise<void>; // New function to mark alerts as read
}

const DatabaseContext = createContext<DatabaseContextProps | undefined>(undefined);

export const DatabaseProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [userGoals, setUserGoals] = useState<Goal[]>([]);
    const [feedPosts, setFeedPosts] = useState<Post[]>([]);
    const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
    const [clans, setClans] = useState<Clan[]>([]);
    const [chatMessages, setChatMessages] = useState<{ [key: string]: ChatMessage[] }>({});
    const [notifications, setNotifications] = useState<Notification[]>([]); // New state for alerts
    const [loading, setLoading] = useState(true);

    // --- YOUR WORKING useEffects (NO CHANGES) ---
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
                const userDocRef = doc(db, "users", user.uid);
                const unsubscribeProfile = onSnapshot(userDocRef, (docSnap) => {
                    setUserProfile(docSnap.exists() ? docSnap.data() as UserProfile : null);
                    if (loading) setLoading(false);
                });
                return () => unsubscribeProfile();
            } else {
                setCurrentUser(null); setUserProfile(null); setUserGoals([]); setFeedPosts([]);
                if (loading) setLoading(false);
            }
        });
        return () => unsubscribeAuth();
    }, [loading]);

    useEffect(() => {
        if (!userProfile?.goalIds || userProfile.goalIds.length === 0) { setUserGoals([]); return; }
        const goalsQuery = query(collection(db, 'goals'), where('__name__', 'in', userProfile.goalIds));
        const unsubscribeGoals = onSnapshot(goalsQuery, (snapshot) => {
            setUserGoals(snapshot.docs.map(g => ({ id: g.id, ...g.data() } as Goal)));
        });
        return () => unsubscribeGoals();
    }, [userProfile]);

    useEffect(() => {
        if (!userProfile) { setFeedPosts([]); return; }
        const usersToFetchFrom = [userProfile.uid, ...(userProfile.following || [])];
        if (usersToFetchFrom.length === 0) { setFeedPosts([]); return; }
        const postsQuery = query(collection(db, "posts"), where("userId", "in", usersToFetchFrom), orderBy("timestamp", "desc"));
        const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
            setFeedPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post)));
        });
        return () => unsubscribePosts();
    }, [userProfile]);

    useEffect(() => {
        const usersQuery = query(collection(db, "users"));
        const unsubscribe = onSnapshot(usersQuery, (snapshot) => setAllUsers(snapshot.docs.map(doc => doc.data() as UserProfile)));
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const clansQuery = query(collection(db, "clans"));
        const unsubscribe = onSnapshot(clansQuery, (snapshot) => setClans(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Clan))));
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!userProfile) return;
        const userClans = clans.filter(c => c.members && c.members.includes(userProfile.uid));
        if (userClans.length === 0) return;
        const unsubscribers = userClans.map(clan => {
            const chatQuery = query(collection(db, "clans", clan.id, "chat"), orderBy("timestamp", "asc"));
            return onSnapshot(chatQuery, (snapshot) => {
                setChatMessages(prev => ({ ...prev, [clan.id]: snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage)) }));
            });
        });
        return () => unsubscribers.forEach(unsub => unsub());
    }, [userProfile, clans]);
    
    // --- **NEW** EFFECT TO LISTEN FOR NOTIFICATIONS ---
    useEffect(() => {
        if (!currentUser) {
            setNotifications([]);
            return;
        }
        // Path: /users/{your_user_id}/notifications
        const notificationsQuery = query(
            collection(db, "users", currentUser.uid, "notifications"),
            orderBy("timestamp", "desc")
        );
        const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
            setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification)));
        });
        return () => unsubscribe();
    }, [currentUser]);

    // --- NEW HELPER FUNCTION TO CREATE A NOTIFICATION ---
    const createNotification = async (userIdToNotify: string, type: Notification['type'], fromUser: UserProfile, postId?: string) => {
        if (userIdToNotify === fromUser.uid) return; // Don't notify yourself
        const notificationRef = collection(db, "users", userIdToNotify, "notifications");
        await addDoc(notificationRef, {
            type,
            fromUserId: fromUser.uid,
            postId: postId || null,
            read: false,
            timestamp: Timestamp.now(),
        });
    };
    
    // --- UPDATED FUNCTIONS TO TRIGGER NOTIFICATIONS ---
    const toggleLike = async (postId: string) => {
        if (!currentUser || !userProfile) return;
        const postRef = doc(db, "posts", postId);
        const post = feedPosts.find(p => p.id === postId);
        if (!post) return;

        if (post.likes.includes(currentUser.uid)) {
            await updateDoc(postRef, { likes: arrayRemove(currentUser.uid) });
        } else {
            await updateDoc(postRef, { likes: arrayUnion(currentUser.uid) });
            await createNotification(post.userId, 'like', userProfile, postId);
        }
    };

    const addComment = async (postId: string, commentText: string) => {
        if (!userProfile) throw new Error("No user profile");
        const post = feedPosts.find(p => p.id === postId);
        if (!post) return;
        
        const newComment: Comment = { userId: userProfile.uid, username: userProfile.username, avatar: userProfile.avatar, content: commentText, timestamp: Timestamp.now() };
        await updateDoc(doc(db, "posts", postId), { comments: arrayUnion(newComment) });
        await createNotification(post.userId, 'comment', userProfile, postId);
    };

    const followUser = async (userIdToFollow: string) => {
        if (!currentUser || !userProfile) return;
        await updateDoc(doc(db, "users", currentUser.uid), { following: arrayUnion(userIdToFollow) });
        await createNotification(userIdToFollow, 'follow', userProfile);
    };

    // --- NEW FUNCTION TO MARK NOTIFICATIONS AS READ ---
    const markNotificationsAsRead = async () => {
        if (!currentUser) return;
        const unreadNotifs = notifications.filter(n => !n.read);
        if (unreadNotifs.length === 0) return;
        
        const promises = unreadNotifs.map(n => {
            const notifRef = doc(db, "users", currentUser.uid, "notifications", n.id);
            return updateDoc(notifRef, { read: true });
        });
        await Promise.all(promises);
    };

    // --- YOUR WORKING FUNCTIONS (NO CHANGES) ---
    const createPost = async (postData: { content: string; type: Post['type']; goalId?: string }) => {
        if (!currentUser) throw new Error("Not logged in");
        await addDoc(collection(db, "posts"), { ...postData, userId: currentUser.uid, timestamp: Timestamp.now(), likes: [], comments: [] });
    };
    const addCheckIn = async (goalId: string, postContent: string) => {
        if (!currentUser) throw new Error("Not logged in");
        await createPost({ content: postContent, type: 'goal_checkin', goalId });
        await updateDoc(doc(db, "users", currentUser.uid), { checkInHistory: arrayUnion(Timestamp.now()) });
        await updateDoc(doc(db, "goals", goalId), { 
            lastCheckIn: Timestamp.now(),
            checkIns: arrayUnion(Timestamp.now())
        });
    };
    const createGoal = async (goalData: { title: string, description: string, isPublic: boolean }) => {
        if (!currentUser) throw new Error("Not logged in");
        const newGoalRef = await addDoc(collection(db, 'goals'), { ...goalData, userId: currentUser.uid, createdAt: Timestamp.now(), checkIns: [] });
        await updateDoc(doc(db, "users", currentUser.uid), { goalIds: arrayUnion(newGoalRef.id) });
    };
    const unfollowUser = async (userIdToUnfollow: string) => { if (!currentUser) return; await updateDoc(doc(db, "users", currentUser.uid), { following: arrayRemove(userIdToUnfollow) }); };
    const sendChatMessage = async (clanId: string, text: string) => { if (!userProfile) return; await addDoc(collection(db, "clans", clanId, "chat"), { userId: userProfile.uid, username: userProfile.username, avatar: userProfile.avatar, text, timestamp: Timestamp.now() }); };
    const joinClan = async (clanId: string) => {
        if (!currentUser) return;
        const clanRef = doc(db, "clans", clanId);
        await updateDoc(clanRef, { members: arrayUnion(currentUser.uid) });
    };
    const clanChat = (clanId: string) => chatMessages[clanId] || [];
    const updateUserProfile = async (data: { fullName?: string; mantra?: string }) => { if (!currentUser) return; await updateDoc(doc(db, "users", currentUser.uid), data); };
    const getUser = async (userId: string) => { const snap = await getDoc(doc(db, "users", userId)); return snap.exists() ? snap.data() as UserProfile : null; };
    const checkUsernameUnique = async (u: string) => { const q = query(collection(db, "users"), where("username", "==", u)); return (await getDocs(q)).empty; };
    const saveUserProfile = async (profileData: any) => {
        if (!currentUser) return;
        const fullProfile: UserProfile = { ...profileData, uid: currentUser.uid, email: currentUser.email, phone: currentUser.phoneNumber, joinedAt: new Date().toISOString(), streak: 0, goalIds: [], following: [], checkInHistory: [] };
        await setDoc(doc(db, "users", currentUser.uid), fullProfile);
        if (profileData.goal === 'Early Risers') {
            const q = query(collection(db, "clans"), where("name", "==", "Early Risers"));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const earlyRisersClan = querySnapshot.docs[0];
                await joinClan(earlyRisersClan.id);
            }
        }
    };
    
    // --- UPDATE: Add the new values to the context ---
    const value = { currentUser, userProfile, userGoals, feedPosts, allUsers, clans, clanChat, loading, notifications, markNotificationsAsRead, checkUsernameUnique, saveUserProfile, createGoal, getUser, updateUserProfile, addCheckIn, toggleLike, addComment, followUser, unfollowUser, sendChatMessage, joinClan };

    return <DatabaseContext.Provider value={value}>{!loading && children}</DatabaseContext.Provider>;
};

export const useDatabase = () => { const c = useContext(DatabaseContext); if (!c) throw new Error('useDatabase error'); return c; };