"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState('english');

    // Load saved language from localStorage on mount
    useEffect(() => {
        const savedLanguage = localStorage.getItem('mediTranslate_language');
        if (savedLanguage) {
            setLanguage(savedLanguage);
        }
    }, []);

    // Save language to localStorage when changed
    const handleSetLanguage = (lang) => {
        setLanguage(lang);
        localStorage.setItem('mediTranslate_language', lang);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    return useContext(LanguageContext);
}
