import React, { useState } from 'react';
import { useDatabase } from '../../contexts/DatabaseContext';
import { ClanCard } from '../../components/dashboard/ClanCard';
import { ClanDetailView } from '../../components/dashboard/ClanDetailView';
import { Clan } from '../../contexts/DatabaseContext';

export const ClanPage = () => {
    const { userProfile, clans } = useDatabase();
    const [selectedClan, setSelectedClan] = useState<Clan | null>(null);

    if (selectedClan) {
        return <ClanDetailView clan={selectedClan} onBack={() => setSelectedClan(null)} />;
    }

    const myClans = userProfile ? clans.filter(c => c.members.includes(userProfile.uid)) : [];
    const discoverClans = userProfile ? clans.filter(c => !c.members.includes(userProfile.uid)) : clans;

    return (
        <div className="w-full max-w-4xl mx-auto flex-grow flex flex-col gap-8">
            <div>
                <h2 className="font-bold text-3xl text-white">Clans</h2>
                <p className="text-gray-400 mt-1">Join forces, stay accountable.</p>
            </div>
            
            {myClans.length > 0 && (
                <div>
                     <h3 className="font-bold text-xl mb-4 text-white">Your Clans</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {myClans.map(clan => <ClanCard key={clan.id} clan={clan} onSelect={() => setSelectedClan(clan)} />)}
                     </div>
                </div>
            )}

            <div>
                <h3 className="font-bold text-xl mb-4 text-white">Discover Clans</h3>
                {discoverClans.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {discoverClans.map(clan => <ClanCard key={clan.id} clan={clan} onSelect={() => setSelectedClan(clan)} />)}
                    </div>
                ) : (
                    <p className="text-gray-500">No new clans to discover right now.</p>
                )}
            </div>
        </div>
    );
};