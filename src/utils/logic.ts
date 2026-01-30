export const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export const validatePassword = (
    password: string,
    userInfo: { firstName?: string; lastName?: string; email?: string } = {}
): { isValid: boolean; message?: string } => {
    if (password.length < 8) {
        return { isValid: false, message: 'Password must be at least 8 characters' };
    }
    if (!/[A-Z]/.test(password)) {
        return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }
    if (!/[a-z]/.test(password)) {
        return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }
    if (!/[0-9]/.test(password)) {
        return { isValid: false, message: 'Password must contain at least one number' };
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return { isValid: false, message: 'Password must contain at least one special character' };
    }

    // Security check: Don't allow password to contain or be the same as name/email
    const lowerPass = password.toLowerCase();
    const checks = [
        userInfo.firstName?.toLowerCase(),
        userInfo.lastName?.toLowerCase(),
        userInfo.email?.split('@')[0].toLowerCase()
    ].filter(Boolean) as string[];

    for (const check of checks) {
        if (check.length >= 3 && lowerPass.includes(check)) {
            return { isValid: false, message: 'Password cannot contain your name or part of your email' };
        }
    }

    return { isValid: true };
};

export const normalizePhoneNumber = (phone: string): string => {
    // Remove all non-numeric characters except +
    return phone.replace(/[^\d+]/g, '');
};

export const isAtLeastAge = (dob: string, minAge: number): boolean => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age >= minAge;
};

export const sanitizeString = (str: string): string => {
    // Basic XSS prevention: remove <script> tags and similar
    return str.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "")
        .replace(/[<>]/g, "");
};
