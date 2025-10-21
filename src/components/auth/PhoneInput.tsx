import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PhoneInputProps {
    value: string; // This will now just be the number part
    onChange: (fullNumber: string) => void; // This will send the FULL number back
    error: string;
}

const countries = [
    { code: "IN", name: "India", dial_code: "+91" },
    { code: "US", name: "United States", dial_code: "+1" },
    { code: "GB", name: "United Kingdom", dial_code: "+44" }
];

export const PhoneInput = ({ value, onChange, error }: PhoneInputProps) => {
    const [selectedCountry, setSelectedCountry] = useState(countries[0]); // Default to India
    const [isOpen, setIsOpen] = useState(false);
    
    // This state holds only the number typed by the user
    const [localValue, setLocalValue] = useState(value);

    // When the local value or country code changes, call the onChange prop
    // with the *combined* full number.
    useEffect(() => {
        onChange(`${selectedCountry.dial_code}${localValue}`);
    }, [localValue, selectedCountry, onChange]);

    return (
        <div className="flex">
            <div className="relative">
                <button 
                    type="button" 
                    onClick={() => setIsOpen(!isOpen)} 
                    className="flex items-center justify-center h-full px-3 bg-gray-200/50 dark:bg-gray-800/50 rounded-l-lg border-r border-gray-300/50 dark:border-gray-700/50"
                >
                    <span>{selectedCountry.code}</span>
                    <span className="ml-1 text-xs">{selectedCountry.dial_code}</span>
                </button>
                 <AnimatePresence>
                    {isOpen && (
                        <motion.ul 
                            initial={{opacity: 0, y: -10}} 
                            animate={{opacity: 1, y: 0}} 
                            exit={{opacity: 0, y: -10}} 
                            className="absolute z-10 bottom-full mb-2 w-48 bg-white/80 dark:bg-[#101010]/80 backdrop-blur-md border border-gray-200/50 dark:border-white/10 rounded-lg shadow-lg max-h-48 overflow-y-auto custom-scrollbar"
                        >
                            {countries.map(country => (
                                <li 
                                    key={country.code} 
                                    onClick={() => { 
                                        setSelectedCountry(country); 
                                        setIsOpen(false); 
                                    }} 
                                    className="px-3 py-2 hover:bg-sky-500/10 cursor-pointer text-sm"
                                >
                                    {country.name} ({country.dial_code})
                                </li>
                            ))}
                        </motion.ul>
                    )}
                 </AnimatePresence>
            </div>
            <input 
                type="tel" 
                placeholder="Phone Number" 
                value={localValue} // Use localValue
                onChange={e => setLocalValue(e.target.value.replace(/[^0-9]/g, ''))} // Update localValue
                className={`w-full px-4 py-3 text-sm text-gray-900 dark:text-white bg-gray-200/50 dark:bg-gray-800/50 border border-transparent rounded-r-lg focus:outline-none transition ${error ? 'ring-2 ring-red-500' : 'focus:ring-2 focus:ring-sky-500 focus:border-transparent'}`} 
            />
        </div>
    );
};