import { Request, Response } from 'express';
import User from '../models/User.js';
import Role from '../models/Role.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import bcrypt from 'bcryptjs';

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, roleName } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log(`[Register Error] User already exists with email: ${email}`);
            return res.status(400).json({ message: 'المستخدم موجود بالفعل' });
        }

        // Find role
        const role = await Role.findOne({ name: roleName || 'User' });
        if (!role) {
            console.log(`[Register Error] Role not found: ${roleName || 'User'}`);
            return res.status(400).json({ message: 'الدور غير موجود' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: role._id,
        });

        console.log(`[Register Success] User registered: ${user.email} with role: ${role.name}`);
        res.status(201).json({
            message: 'تم تسجيل المستخدم بنجاح',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: role.name,
            },
        });
    } catch (error: any) {
        console.error(`[Register Error] ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Find user and select password
        const user = await User.findOne({ email, isDeleted: false }).select('+password').populate('role');
        if (!user) {
            console.log(`[Login Error] User not found: ${email}`);
            return res.status(401).json({ message: 'بيانات الاعتماد غير صالحة (المستخدم غير موجود)' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            console.log(`[Login Error] Incorrect password for user: ${email}`);
            return res.status(401).json({ message: 'بيانات الاعتماد غير صالحة (كلمة المرور خاطئة)' });
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
            message: 'تم تسجيل الدخول بنجاح',
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
            return res.status(401).json({ message: 'مطلوب رمز التحديث' });
        }

        const decoded: any = verifyRefreshToken(token);
        const user = await User.findById(decoded.id).populate('role');
        if (!user || user.isDeleted) {
            return res.status(401).json({ message: 'المستخدم غير موجود' });
        }

        const accessToken = generateAccessToken({ id: user._id, role: (user.role as any).name });

        res.json({ accessToken });
    } catch (error: any) {
        res.status(401).json({ message: 'رمز التحديث غير صالح' });
    }
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie('refreshToken');
    res.json({ message: 'تم تسجيل الخروج بنجاح' });
};

export const getMe = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const user = await User.findById(userId).populate('role');
        if (!user) {
            return res.status(404).json({ message: 'المستخدم غير موجود' });
        }

        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: (user.role as any).name,
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const changePassword = async (req: Request, res: Response) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = (req as any).user?.id;

        const user = await User.findById(userId).select('+password');
        if (!user) {
            return res.status(404).json({ message: 'المستخدم غير موجود' });
        }

        // Check current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'كلمة المرور الحالية غير صحيحة' });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({ message: 'تم تغيير كلمة المرور بنجاح' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
