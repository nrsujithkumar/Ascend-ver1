import React, { ReactNode } from 'react';
import { Twitter, MessageCircle } from 'lucide-react';
import { SocialIcon } from './SocialIcon';
import { GitHubIcon } from '../icons/GithubIcon';

interface FooterProps {
    onOpenLegalModal: (type: 'terms' | 'privacy') => void;
}

export const Footer = ({ onOpenLegalModal }: FooterProps) => {
    const year = new Date().getFullYear(); //
    const socialLinks = [
        { name: 'Twitter', icon: <Twitter size={20} />, href: '#' },
        { name: 'GitHub', icon: <GitHubIcon />, href: '#' },
        { name: 'Community', icon: <MessageCircle size={20} />, href: '#' }
    ]; //
    const navLinks = [
        { name: 'Features', href: '#features' }, { name: 'How It Works', href: '#how-it-works' },
        { name: 'About', href: '#about' }, { name: 'Join', href: '#join' },
    ]; //
    const legalLinks = [
        { name: 'Terms of Service', type: 'terms' as const }, { name: 'Privacy Policy', type: 'privacy' as const },
    ]; //

    return (
        <footer className="border-t border-gray-200/50 dark:border-white/10"> {/* */}
            <div className="container mx-auto px-4 sm:px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-5">
                         <a href="#home" className="text-2xl font-bold tracking-wider text-gray-900 dark:text-white"> {/* */}
                            Ascend<span className="text-sky-400">.</span>
                        </a>
                        <p className="text-base text-gray-600 dark:text-gray-400 mt-4 max-w-xs">
                            Your personal launchpad for discipline and focus. {/* */}
                        </p>
                        <div className="flex space-x-6 mt-6">
                            {socialLinks.map(link => <SocialIcon key={link.name} {...link} />)} {/* */}
                        </div>
                    </div>
                    
                    <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
                         <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white tracking-wider uppercase text-sm">Navigate</h3>
                            <ul className="mt-4 space-y-3">
                                {navLinks.map(link => (
                                    <li key={link.name}><a href={link.href} className="text-base text-gray-600 dark:text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">{link.name}</a></li>
                                ))} {/* */}
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white tracking-wider uppercase text-sm">Legal</h3>
                             <ul className="mt-4 space-y-3">
                                {legalLinks.map(link => (
                                    <li key={link.name}><button onClick={() => onOpenLegalModal(link.type)} className="text-base text-gray-600 dark:text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors text-left">{link.name}</button></li>
                                ))} {/* */}
                            </ul>
                        </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white tracking-wider uppercase text-sm">Contact</h3>
                            <ul className="mt-4 space-y-3">
                                <li><a href="mailto:support@ascend.app" className="text-base text-gray-600 dark:text-gray-400 hover:text-sky-500 dark:hover:text-sky-400 transition-colors">support@ascend.app</a></li> {/* */}
                            </ul>
                        </div>
                    </div>
                 </div>

                <div className="mt-16 pt-8 border-t border-gray-200/50 dark:border-white/10 text-center text-base text-gray-500">
                    <p>&copy; {year} Ascend Technologies Inc. All rights reserved.</p> {/* */}
                </div>
            </div>
        </footer>
    );
};