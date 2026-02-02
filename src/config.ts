const getLocalApiUrl = () => {
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        return `http://${window.location.hostname}:8000`;
    }
    // Fallback for production is empty string if not provided via env, 
    // which allows for relative paths if the API is proxied.
    // However, it's better than hardcoding 127.0.0.1 which fails on public sites.
    return '';
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || getLocalApiUrl();

