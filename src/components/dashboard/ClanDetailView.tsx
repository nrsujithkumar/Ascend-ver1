import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Flame } from 'lucide-react';
import { useDatabase, Clan, UserProfile } from '../../contexts/DatabaseContext';
import { PostCard } from './PostCard';
import { AVATAR_MAP } from '../avatars';

export const ClanDetailView = ({ clan, onBack }: { clan: Clan, onBack: () => void }) => {
    const { userProfile, getUser, feedPosts, clanChat, sendChatMessage } = useDatabase();
    const [clanMembers, setClanMembers] = useState<UserProfile[]>([]);
    const [chatMessage, setChatMessage] = useState('');
    const chatEndRef = useRef<HTMLDivElement>(null);
    const messages = clanChat(clan.id);

    useEffect(() => {
        Promise.all(clan.members.map(id => getUser(id))).then(members => {
            setClanMembers(members.filter(m => m !== null) as UserProfile[]);
        });
    }, [clan.members, getUser]);

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const handleChatSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (chatMessage.trim()) {
            sendChatMessage(clan.id, chatMessage);
            setChatMessage('');
        }
    };
    
    const clanFeed = feedPosts.filter(p => clan.members.includes(p.userId));

    return (
        <div className="w-full flex-grow flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-2/3 flex flex-col gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-4">
                    <button onClick={onBack} className="text-gray-400 hover:text-white"><ArrowLeft /></button>
                    <div><h2 className="text-2xl font-bold text-white">{clan.name}</h2><p className="text-gray-400">{clan.members.length} Members</p></div>
                </div>
                <div className="overflow-y-auto custom-scrollbar flex-grow p-4 bg-white/5 rounded-2xl border border-white/10"><div className="flex flex-col gap-4">{clanFeed.map(post => <PostCard key={post.id} post={post} />)}</div></div>
            </div>
            <div className="w-full lg:w-1/3 flex flex-col gap-6">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                    <h3 className="font-bold text-white mb-3">Leaderboard</h3>
                    <div className="space-y-2">{clanMembers.sort((a, b) => b.streak - a.streak).map((member, index) => (<div key={member.uid} className="flex items-center gap-3 text-sm"><span className="font-bold w-6 text-white">{index + 1}.</span><div className="w-8 h-8 text-sky-400">{React.createElement((AVATAR_MAP as any)[member.avatar])}</div><span className="font-semibold text-white">{member.username}</span><span className="ml-auto font-bold flex items-center gap-1 text-white">{member.streak} <Flame size={14} className="text-orange-400" /></span></div>))}</div>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex-grow flex flex-col">
                    <h3 className="font-bold text-white mb-3">Clan Chat</h3>
                    <div className="flex-grow overflow-y-auto custom-scrollbar pr-2 -mr-2 mb-2">
                        <div className="space-y-3">{messages.map(msg => { const isMe = msg.userId === userProfile?.uid; return (<div key={msg.id} className={`flex items-start gap-2 ${isMe ? 'justify-end' : ''}`}>{!isMe && <div className="w-6 h-6 shrink-0 mt-1 text-sky-400">{React.createElement((AVATAR_MAP as any)[msg.avatar])}</div>}<div className={`p-2 rounded-lg max-w-[80%] ${isMe ? 'bg-sky-600 text-white rounded-br-none' : 'bg-gray-700 rounded-bl-none'}`}>{!isMe && <p className="text-xs font-bold text-sky-400">{msg.username}</p>}<p className="text-sm text-white">{msg.text}</p></div></div>)})}</div>
                        <div ref={chatEndRef} />
                    </div>
                    <form onSubmit={handleChatSubmit} className="flex gap-2">
                        <input value={chatMessage} onChange={e => setChatMessage(e.target.value)} type="text" placeholder="Send a message..." className="w-full px-3 py-2 text-sm text-white bg-gray-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
                        <button type="submit" className="bg-sky-500 rounded-lg px-3 text-white"><Send size={18} /></button>
                    </form>
                </div>
            </div>
        </div>
    );
};