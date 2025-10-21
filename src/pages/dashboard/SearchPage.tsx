import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Users, User } from 'lucide-react';
import { useDatabase } from '../../contexts/DatabaseContext';
import { UserCard } from '../../components/dashboard/UserCard';
import { ClanCard } from '../../components/dashboard/ClanCard';
import { useNavigate } from 'react-router-dom'; // To handle clan card clicks

export const SearchPage = () => {
    const { userProfile, allUsers, clans } = useDatabase();
    const [query, setQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'users' | 'clans'>('users'); // State to track the active tab
    const navigate = useNavigate(); // Hook to navigate to clan detail page

    // Memoized filtering logic for users
    const filteredUsers = useMemo(() => {
        const lowerCaseQuery = query.toLowerCase();
        const otherUsers = allUsers.filter(u => u.uid !== userProfile?.uid);
        if (!query) return otherUsers;
        return otherUsers.filter(u => 
            u.username.toLowerCase().includes(lowerCaseQuery) || 
            u.fullName.toLowerCase().includes(lowerCaseQuery)
        );
    }, [query, allUsers, userProfile]);

    // Memoized filtering logic for clans
    const filteredClans = useMemo(() => {
        const lowerCaseQuery = query.toLowerCase();
        if (!query) return clans;
        return clans.filter(c => 
            c.name.toLowerCase().includes(lowerCaseQuery) ||
            c.description.toLowerCase().includes(lowerCaseQuery)
        );
    }, [query, clans]);
    
    return (
        <div className="w-full max-w-2xl mx-auto flex-grow flex flex-col gap-4">
            {/* --- SEARCH INPUT --- */}
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder={`Search for ${activeTab}...`}
                    className="w-full pl-10 pr-4 py-3 text-sm text-white bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>

            {/* --- TAB SWITCHER --- */}
            <div className="flex p-1 bg-white/5 rounded-lg">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`relative w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'users' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                >
                    {activeTab === 'users' && <motion.div layoutId="search-tab" className="absolute inset-0 bg-sky-500/20 rounded-md" />}
                    <span className="relative z-10 flex items-center justify-center gap-2"><User size={16} /> Users</span>
                </button>
                <button
                    onClick={() => setActiveTab('clans')}
                    className={`relative w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${activeTab === 'clans' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                >
                    {activeTab === 'clans' && <motion.div layoutId="search-tab" className="absolute inset-0 bg-sky-500/20 rounded-md" />}
                    <span className="relative z-10 flex items-center justify-center gap-2"><Users size={16} /> Clans</span>
                </button>
            </div>

            {/* --- RESULTS LIST --- */}
             <div className="overflow-y-auto custom-scrollbar flex-grow pr-2 -mr-2">
                {activeTab === 'users' && (
                    <div className="space-y-3">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => <UserCard key={user.uid} user={user} />)
                        ) : (
                            <p className="text-center text-gray-500 pt-8">{query ? `No users found for "${query}".` : "No other users to display."}</p>
                        )}
                    </div>
                )}
                {activeTab === 'clans' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredClans.length > 0 ? (
                            // NOTE: We can't navigate to the clan detail page from here yet.
                            // We will add that functionality when we build the Clan Page itself.
                            filteredClans.map(clan => <ClanCard key={clan.id} clan={clan} onSelect={() => alert(`Selected clan: ${clan.name}`)} />)
                        ) : (
                            <p className="text-center text-gray-500 pt-8 col-span-2">{query ? `No clans found for "${query}".` : "No clans to display."}</p>
                        )}
                    </div>
                )}
             </div>
        </div>
    );
};