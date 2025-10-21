import React, { useEffect, useState } from 'react';
import { useDatabase, Notification, UserProfile } from '../../contexts/DatabaseContext';
import { AVATAR_MAP } from '../../components/avatars';
import { Heart, UserPlus, MessageSquare, BellRing, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotificationRow = ({ notification }: { notification: Notification }) => {
    const { getUser } = useDatabase();
    const [fromUser, setFromUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        getUser(notification.fromUserId).then(setFromUser);
    }, [notification, getUser]);

    if (!fromUser) {
        return <div className="p-3 h-16 rounded-lg bg-white/5 animate-pulse"></div>;
    }

    const AvatarComponent = fromUser.avatar ? AVATAR_MAP[fromUser.avatar as keyof typeof AVATAR_MAP] : UserIcon;
    let icon, message, linkTo;

    switch (notification.type) {
        case 'follow':
            icon = <div className="bg-sky-500/20 rounded-full p-1.5"><UserPlus className="text-sky-400" size={20} /></div>;
            message = <><span className="font-bold text-white">{fromUser.username}</span> started following you.</>;
            linkTo = `/dashboard/profile/${fromUser.uid}`;
            break;
        case 'like':
            icon = <div className="bg-red-500/20 rounded-full p-1.5"><Heart className="text-red-500" size={20} /></div>;
            message = <><span className="font-bold text-white">{fromUser.username}</span> liked your post.</>;
            linkTo = `/dashboard`;
            break;
        case 'comment':
            icon = <div className="bg-green-500/20 rounded-full p-1.5"><MessageSquare className="text-green-400" size={20} /></div>;
            message = <><span className="font-bold text-white">{fromUser.username}</span> commented on your post.</>;
            linkTo = `/dashboard`;
            break;
        default: return null;
    }

    return (
        <Link to={linkTo} className={`block p-3 rounded-lg flex items-center gap-4 transition-colors no-underline ${!notification.read ? 'bg-sky-500/10' : 'bg-transparent hover:bg-white/5'}`}>
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center relative">
                {icon}
                <div className="w-8 h-8 absolute -right-2 -bottom-2 text-sky-400 border-2 border-gray-800 rounded-full p-0.5">
                    <div className="bg-gray-800 rounded-full w-full h-full flex items-center justify-center">
                        <AvatarComponent />
                    </div>
                </div>
            </div>
            <p className="text-sm text-gray-300 ml-2">{message}</p>
            {!notification.read && <div className="w-2.5 h-2.5 rounded-full bg-sky-400 ml-auto flex-shrink-0" />}
        </Link>
    );
};

export const AlertsPage = () => {
    const { notifications, markNotificationsAsRead } = useDatabase();
    
    useEffect(() => {
        const timer = setTimeout(() => {
            markNotificationsAsRead();
        }, 2000);
        return () => clearTimeout(timer);
    }, [notifications, markNotificationsAsRead]);

    return (
        <div className="w-full max-w-2xl mx-auto flex-grow flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-white">Notifications</h2>
            <div className="overflow-y-auto custom-scrollbar flex-grow pr-2 -mr-2">
                 <div className="space-y-2">
                    {notifications.length > 0 ? (
                        notifications.map(notif => <NotificationRow key={notif.id} notification={notif} />)
                    ) : (
                        <div className="text-center text-gray-500 pt-20 flex flex-col items-center gap-4">
                            <BellRing size={48} />
                            <h3 className="font-bold text-lg text-white">All caught up!</h3>
                            <p className="max-w-xs">You don't have any new notifications right now. Check back later!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};