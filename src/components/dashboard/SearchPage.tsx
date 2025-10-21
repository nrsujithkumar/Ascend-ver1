import React, { useState, useMemo } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { useDatabase } from '../../contexts/DatabaseContext';
import { UserCard } from '../../components/dashboard/UserCard';

export const SearchPage = () => {
    const { userProfile, allUsers } = useDatabase();
    const [query, setQuery] = useState('');

    const filteredUsers = useMemo(() => {
        if (!query) return allUsers.filter(u => u.uid !== userProfile?.uid);
        return allUsers.filter(u => 
            u.uid !== userProfile?.uid &&
            (u.username.toLowerCase().includes(query.toLowerCase()) || 
             u.fullName.toLowerCase().includes(query.toLowerCase()))
        );
    }, [query, allUsers, userProfile]);
    
    return (
        <div className="w-full max-w-2xl mx-auto flex-grow flex flex-col gap-4">
            <div className="relative">
                <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search for users..." className="w-full pl-10 pr-4 py-3 text-sm text-white bg-white/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
                <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            </div>
             <div className="overflow-y-auto custom-scrollbar flex-grow pr-2 -mr-2">
                 <div className="space-y-3">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => <UserCard key={user.uid} user={user} />)
                    ) : (
                        <p className="text-center text-gray-500 pt-8">No users found.</p>
                    )}
                 </div>
             </div>
        </div>
    );
};