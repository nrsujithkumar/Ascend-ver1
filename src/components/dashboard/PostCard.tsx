// Filename: src/components/dashboard/PostCard.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageSquare, Share2, Send, User as UserIcon } from 'lucide-react';
import { useDatabase, Post, UserProfile } from '../../contexts/DatabaseContext';
import { AVATAR_MAP } from '../avatars';
import { useModal } from '../../contexts/ModalContext';
import { GoalDetailModal } from './GoalDetailModal';

const timeAgo = (timestamp: any) => {
    if (!timestamp) return '...';
    const now = Date.now();
    const seconds = Math.floor((now - timestamp.toDate().getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};

export const PostCard = ({ post }: { post: Post }) => {
    const { currentUser, toggleLike, addComment, getUser, userGoals } = useDatabase();
    const { showModal } = useModal();
    const [author, setAuthor] = useState<UserProfile | null>(null);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');

    useEffect(() => { getUser(post.userId).then(setAuthor); }, [post.userId, getUser]);
    
    const postGoal = post.goalId ? userGoals.find(g => g.id === post.goalId) : null;

    if (!currentUser || !author) {
        return <div className="bg-white/5 h-32 rounded-2xl border border-gray-200/50 dark:border-white/10 animate-pulse"></div>;
    }

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            addComment(post.id, newComment);
            setNewComment('');
        }
    };

    const isLiked = post.likes.includes(currentUser.uid);
    const AvatarComponent = author.avatar ? AVATAR_MAP[author.avatar as keyof typeof AVATAR_MAP] : null;
    
    return (
        <div className="bg-white/5 dark:bg-black/10 p-4 rounded-2xl border border-gray-200/50 dark:border-white/10">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 text-sky-400 flex-shrink-0">{AvatarComponent ? <AvatarComponent /> : <UserIcon />}</div>
                <div>
                    <p className="font-bold text-white">{author.username}</p>
                    <p className="text-xs text-gray-500">{timeAgo(post.timestamp)}</p>
                </div>
                {post.type === 'goal_checkin' && <div className="ml-auto text-xs font-bold px-2 py-1 bg-green-400/20 text-green-300 rounded-full">🎯 VOW</div>}
            </div>
            
            {postGoal && (
                <div onClick={() => showModal(<GoalDetailModal goal={postGoal} />)} className="text-xs text-sky-400 bg-sky-500/10 px-2 py-1 rounded-md inline-block mb-2 cursor-pointer hover:bg-sky-500/20">
                    Linked to Vow: <span className="font-bold">{postGoal.title}</span>
                </div>
            )}
            
            <p className="text-gray-300 mb-4 whitespace-pre-wrap">{post.content}</p>
            
            <div className="flex items-center gap-4 text-gray-500 text-sm">
                <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1.5 hover:text-red-500 transition-colors ${isLiked ? 'text-red-500' : ''}`}>
                    <Heart size={16} fill={isLiked ? 'currentColor' : 'none'}/> {post.likes.length}
                </button>
                <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1.5 hover:text-sky-400 transition-colors"><MessageSquare size={16} /> {post.comments.length}</button>
                <button className="flex items-center gap-1.5 hover:text-sky-400 transition-colors ml-auto"><Share2 size={16} /></button>
            </div>
            <AnimatePresence>
            {showComments && (
                <motion.div initial={{opacity: 0, height: 0}} animate={{opacity: 1, height: 'auto'}} exit={{opacity: 0, height: 0}} className="mt-4 pt-4 border-t border-white/10">
                    <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-2 -mr-2 mb-3">
                        {post.comments.length > 0 ? post.comments.map((comment, index) => {
                             const CommentAvatar = comment.avatar ? AVATAR_MAP[comment.avatar as keyof typeof AVATAR_MAP] : null;
                             return (
                                <div key={index} className="flex items-start gap-2 text-sm">
                                    <div className="w-6 h-6 flex-shrink-0 text-sky-400">{CommentAvatar ? <CommentAvatar/> : <UserIcon/>}</div>
                                    <div><span className="font-bold mr-2 text-white">{comment.username}</span><span className="text-gray-300">{comment.content}</span></div>
                                </div>
                            )
                        }) : <p className="text-xs text-gray-500 text-center">No comments yet.</p>}
                    </div>
                    <form onSubmit={handleCommentSubmit} className="flex gap-2 mt-2">
                        <input value={newComment} onChange={e => setNewComment(e.target.value)} type="text" placeholder="Add a comment..." className="w-full px-3 py-1.5 text-sm text-white bg-gray-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
                        <button type="submit" className="bg-sky-500 rounded-lg px-3 text-white"><Send size={16} /></button>
                    </form>
                </motion.div>
            )}
            </AnimatePresence>
        </div>
    );
};