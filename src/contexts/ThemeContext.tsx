import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextProps {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => { // [cite: 48]
    const [theme, setTheme] = useState<Theme>('dark'); // [cite: 48]

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme); // [cite: 49]
    }, [theme]);

    const toggleTheme = () => { // [cite: 50]
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light')); // [cite: 50]
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}> {/* [cite: 51] */}
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => { // [cite: 53]
    const context = useContext(ThemeContext);
    if (!context) { // [cite: 54]
        throw new Error('useTheme must be used within a ThemeProvider'); // [cite: 54]
    }
    return context; // [cite: 55]
};