import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider } from '../src/contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import Auth from '../src/pages/Auth';

// Mock fetch
globalThis.fetch = vi.fn();

const renderAuth = () => {
    return render(
        <BrowserRouter>
            <AuthProvider>
                <Auth />
            </AuthProvider>
        </BrowserRouter>
    );
};

describe('API Integration Tests', () => {
    const MOCK_EMAIL = 'api-test@example.com';
    const MOCK_PASSWORD = 'Password123!';
    const MOCK_INVALID_PASSWORD = 'Secret123!'; // Used for testing error cases

    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it('integration: should handle successful login and update global state', async () => {
        const mockLoginResponse = {
            access: 'fake-access-token',
            refresh: 'fake-refresh-token'
        };

        const mockMeResponse = {
            id: '1',
            username: 'api-test@example.com',
            email: 'api-test@example.com',
            role: 'client',
            verified: true
        };

        (globalThis.fetch as any)
            .mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => mockLoginResponse,
            })
            .mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => mockMeResponse,
            });

        renderAuth();

        fireEvent.change(screen.getByPlaceholderText(/Enter your email address/i), {
            target: { value: MOCK_EMAIL }
        });
        fireEvent.change(screen.getByPlaceholderText(/Must be at least 8 characters/i), {
            target: { value: MOCK_PASSWORD }
        });

        fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

        await waitFor(() => {
            expect(localStorage.getItem('accessToken')).toBe('fake-access-token');
            expect(globalThis.fetch).toHaveBeenCalledWith(expect.stringContaining('/api/auth/login/'), expect.anything());
        });
    });

    it('integration: should handle API error responses gracefully', async () => {
        (globalThis.fetch as any).mockResolvedValueOnce({
            ok: false,
            status: 401,
            json: async () => ({ detail: 'Invalid credentials' }),
        });

        const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => { });

        renderAuth();

        // Wait for potential initial loading to finish
        const emailInput = await screen.findByPlaceholderText(/Enter your email address/i);
        const passwordInput = screen.getByPlaceholderText(/Must be at least 8 characters/i);
        const submitButton = screen.getByRole('button', { name: /Sign In/i });

        fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
        fireEvent.change(passwordInput, { target: { value: MOCK_INVALID_PASSWORD } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(alertSpy).toHaveBeenCalled();
        }, { timeout: 5000 });

        alertSpy.mockRestore();
    });
});
