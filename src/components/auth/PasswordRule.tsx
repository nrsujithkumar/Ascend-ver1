import React from 'react';
import { Check, X } from 'lucide-react';

export const PasswordRule = ({ text, isValid }: { text: string, isValid: boolean }) => (
    <div className={`flex items-center text-xs transition-colors ${isValid ? 'text-green-400' : 'text-gray-500'}`}>
        {isValid ? <Check size={14} className="mr-2 flex-shrink-0" /> : <X size={14} className="mr-2 flex-shrink-0" />}
        <span>{text}</span>
    </div>
);