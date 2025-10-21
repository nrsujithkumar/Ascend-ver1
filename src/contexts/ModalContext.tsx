import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';

// Define what the context will provide
interface ModalContextType {
    showModal: (content: ReactNode) => void;
    hideModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

// The provider component
export const ModalProvider = ({ children }: { children: ReactNode }) => {
    const [modalContent, setModalContent] = useState<ReactNode | null>(null);

    const showModal = (content: ReactNode) => setModalContent(content);
    const hideModal = () => setModalContent(null);

    const value = { showModal, hideModal };

    return (
        <ModalContext.Provider value={value}>
            {children}
            {/* AnimatePresence will handle the modal's fade-in/out */}
            <AnimatePresence>
                {modalContent}
            </AnimatePresence>
        </ModalContext.Provider>
    );
};

// The custom hook to easily use the context
export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};