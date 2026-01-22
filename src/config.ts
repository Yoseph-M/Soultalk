const getLocalApiUrl = () => {
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        return `http://${window.location.hostname}:8000`;
    }
    return 'http://127.0.0.1:8000';
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || getLocalApiUrl();
