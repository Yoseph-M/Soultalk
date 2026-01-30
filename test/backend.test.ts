import { describe, it, expect } from 'vitest';
import { validateEmail, validatePassword, normalizePhoneNumber, isAtLeastAge, sanitizeString } from '../src/utils/logic';

describe('Backend Business Logic Unit Tests', () => {
    describe('validateEmail', () => {
        it('should return true for valid emails', () => {
            expect(validateEmail('test@example.com')).toBe(true);
            expect(validateEmail('user.name+tag@domain.co.uk')).toBe(true);
        });

        it('should return false for invalid emails', () => {
            expect(validateEmail('invalid-email')).toBe(false);
            expect(validateEmail('@domain.com')).toBe(false);
            expect(validateEmail('user@')).toBe(false);
        });
    });

    describe('validatePassword', () => {
        it('should validate password length', () => {
            const result = validatePassword('Sh1!');
            expect(result.isValid).toBe(false);
            expect(result.message).toContain('8 characters');
        });

        it('should require an uppercase letter', () => {
            const result = validatePassword('lowercase1!');
            expect(result.isValid).toBe(false);
            expect(result.message).toContain('uppercase letter');
        });

        it('should require a lowercase letter', () => {
            const result = validatePassword('UPPERCASE1!');
            expect(result.isValid).toBe(false);
            expect(result.message).toContain('lowercase letter');
        });

        it('should require a number', () => {
            const result = validatePassword('NoNumberUpperLower!');
            expect(result.isValid).toBe(false);
            expect(result.message).toContain('number');
        });

        it('should require a special character', () => {
            const result = validatePassword('NoSpecial123v');
            expect(result.isValid).toBe(false);
            expect(result.message).toContain('special character');
        });

        it('should not allow password to contain user firstName', () => {
            const result = validatePassword('HelloZube1!', { firstName: 'Zube' });
            expect(result.isValid).toBe(false);
            expect(result.message).toContain('cannot contain your name');
        });

        it('should not allow password to contain email prefix', () => {
            const result = validatePassword('TestUser123!', { email: 'testuser@gmail.com' });
            expect(result.isValid).toBe(false);
            expect(result.message).toContain('cannot contain your name or part of your email');
        });

        it('should return true for valid complex passwords', () => {
            const result = validatePassword('SecurePass123!', { firstName: 'John' });
            expect(result.isValid).toBe(true);
        });
    });

    describe('Security and Formatting Utilities', () => {
        it('normalizePhoneNumber: should strip spaces and dashes', () => {
            expect(normalizePhoneNumber('+1-555 123-4567')).toBe('+15551234567');
        });

        it('isAtLeastAge: should validate user age correctly', () => {
            const over18 = new Date();
            over18.setFullYear(over18.getFullYear() - 20);
            expect(isAtLeastAge(over18.toISOString(), 18)).toBe(true);

            const under18 = new Date();
            under18.setFullYear(under18.getFullYear() - 10);
            expect(isAtLeastAge(under18.toISOString(), 18)).toBe(false);
        });

        it('sanitizeString: should remove script tags and brackets', () => {
            const dirty = 'Hello <script>alert("XSS")</script> World';
            expect(sanitizeString(dirty)).toBe('Hello  World');
        });
    });
});
