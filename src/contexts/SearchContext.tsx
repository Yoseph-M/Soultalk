import React, { createContext, useContext, useState } from 'react';

interface SearchContextType {
    globalSearch: string;
    setGlobalSearch: (s: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [globalSearch, setGlobalSearch] = useState('');
    return (
        <SearchContext.Provider value={{ globalSearch, setGlobalSearch }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        // Return a dummy if not in provider, but ideally we wrap the app
        return { globalSearch: '', setGlobalSearch: () => { } };
    }
    return context;
};
