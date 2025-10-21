import React from 'react';

interface AuthInputProps {
    id: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: boolean;
}

export const AuthInput = ({ id, type, placeholder, value, onChange, error }: AuthInputProps) => (
    <div className="w-full">
        <label htmlFor={id} className="sr-only">{placeholder}</label>
        <input 
            id={id} 
            name={id} 
            type={type} 
            required 
            value={value} 
            onChange={onChange} 
            className={`w-full px-4 py-3 text-sm text-gray-900 dark:text-white bg-gray-200/50 dark:bg-gray-800/50 border border-transparent rounded-lg focus:outline-none transition ${error ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-sky-500 focus:border-transparent'}`} 
            placeholder={placeholder} 
        />
    </div>
);