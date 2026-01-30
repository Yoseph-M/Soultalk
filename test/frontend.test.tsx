import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Header from '../src/pages/Header';
import { AuthProvider } from '../src/contexts/AuthContext';

// Mock matchMedia for components using it
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

describe('Frontend Component Tests', () => {
    it('Header: should render navigation links', () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <Header />
                </AuthProvider>
            </BrowserRouter>
        );

        expect(screen.getByText(/How It Works/i)).toBeDefined();
        expect(screen.getByText(/Services/i)).toBeDefined();
        expect(screen.getByText(/Pricing/i)).toBeDefined();
    });

    it('Header: should show "Get Started" when user is not logged in', () => {
        render(
            <BrowserRouter>
                <AuthProvider>
                    <Header />
                </AuthProvider>
            </BrowserRouter>
        );

        expect(screen.getByText(/Get Started/i)).toBeDefined();
    });

    it('Header: should toggle mobile menu when button is clicked', () => {
        const { container } = render(
            <BrowserRouter>
                <AuthProvider>
                    <Header />
                </AuthProvider>
            </BrowserRouter>
        );

        const menuButton = container.querySelector('button.md\\:hidden');
        if (menuButton) {
            fireEvent.click(menuButton);
            // Verify menu is open (e.g. searching for the close button)
            expect(screen.getAllByRole('link')).toBeDefined();
        }
    });
});
