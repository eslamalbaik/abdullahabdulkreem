import { Request, Response } from 'express';
import User from '../models/User.js';
import Role from '../models/Role.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { authStorage } from '../replit_integrations/auth/storage.js';
import bcrypt from 'bcryptjs';

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, roleName } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Find role
        const role = await Role.findOne({ name: roleName || 'User' });
        if (!role) {
            return res.status(400).json({ message: 'Role not found' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: role._id,
        });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: role.name,
            },
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Find user and select password
        const user = await User.findOne({ email, isDeleted: false }).select('+password').populate('role');
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate tokens
        const accessToken = generateAccessToken({ id: user._id, role: (user.role as any).name });
        const refreshToken = generateRefreshToken({ id: user._id });

        // Set refresh token in cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.json({
            message: 'Login successful',
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: (user.role as any).name,
            },
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) {
            return res.status(401).json({ message: 'Refresh token required' });
        }

        const decoded: any = verifyRefreshToken(token);
        const user = await User.findById(decoded.id).populate('role');
        if (!user || user.isDeleted) {
            return res.status(401).json({ message: 'User not found' });
        }

        const accessToken = generateAccessToken({ id: user._id, role: (user.role as any).name });

        res.json({ accessToken });
    } catch (error: any) {
        res.status(401).json({ message: 'Invalid refresh token' });
    }
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie('refreshToken');
    res.json({ message: 'Logged out successfully' });
};

export const changePassword = async (req: Request, res: Response) => {
    // Debug logging as requested
    console.log('[authController] req.headers.authorization:', req.headers.authorization);
    console.log('[authController] User from request:', (req as any).user?.id || (req as any).user?.email);

    try {
        const { currentPassword, newPassword } = req.body;
        const userId = (req as any).user?.id;

        console.log(`[authController] Change password attempt for user ID: ${userId}`);

        // 1. Try PostgreSQL first (Modern/Session Auth)
        const dbUser = await authStorage.getUser(userId);

        if (dbUser) {
            console.log(`[authController] User found in PostgreSQL: ${userId}`);

            // Check current password if it exists (might be empty for initial OIDC login)
            if (dbUser.password) {
                const isMatch = await bcrypt.compare(currentPassword, dbUser.password);
                if (!isMatch) {
                    console.warn(`[authController] Current password mismatch in PostgreSQL for user: ${userId}`);
                    return res.status(400).json({ message: 'كلمة المرور الحالية غير صحيحة' });
                }
            }

            // Update password in PostgreSQL
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await authStorage.updateUserPassword(userId, hashedPassword);

            console.log(`[authController] PostgreSQL password updated successfully for user: ${userId}`);
            return res.json({ message: 'تم تغيير كلمة المرور بنجاح (PostgreSQL)' });
        }

        // 2. Fallback to MongoDB (Legacy JWT Auth)
        console.log(`[authController] User not found in PostgreSQL, trying MongoDB: ${userId}`);
        const mongoUser = await User.findById(userId).select('+password');
        if (!mongoUser) {
            console.warn(`[authController] User not found in either DB: ${userId}`);
            return res.status(404).json({ message: 'المستخدم غير موجود' });
        }

        // Check current password
        const isMatch = await mongoUser.comparePassword(currentPassword);
        if (!isMatch) {
            console.warn(`[authController] Current password mismatch in MongoDB for user: ${userId}`);
            return res.status(400).json({ message: 'كلمة المرور الحالية غير صحيحة' });
        }

        // Update password in MongoDB
        mongoUser.password = newPassword;
        await mongoUser.save();

        console.log(`[authController] MongoDB password updated successfully for user: ${userId}`);
        res.json({ message: 'تم تغيير كلمة المرور بنجاح (MongoDB)' });
    } catch (error: any) {
        console.error(`[authController] Error in changePassword:`, error);
        res.status(500).json({ message: error.message });
    }
};
