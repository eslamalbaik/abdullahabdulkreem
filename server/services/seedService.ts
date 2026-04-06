import Role from '../models/Role.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const seedRoles = async () => {
    const roles = [
        {
            name: 'Admin',
            description: 'Full access to all resources',
            permissions: ['all'],
        },
        {
            name: 'Editor',
            description: 'Can manage content but not users',
            permissions: ['read', 'write', 'update'],
        },
        {
            name: 'User',
            description: 'Standard user access',
            permissions: ['read'],
        },
    ];

    try {
        for (const role of roles) {
            await Role.findOneAndUpdate({ name: role.name }, role, { upsert: true });
        }
        console.log('Roles seeded successfully');

        // Seed default admin user if none exists
        const adminEmail = process.env.LOCAL_ADMIN_EMAIL || 'admin@local.dev';
        const adminPassword = process.env.LOCAL_ADMIN_PASSWORD || '123';

        const adminRole = await Role.findOne({ name: 'Admin' });
        if (adminRole) {
            const admin = await User.findOne({ email: adminEmail }).select('+password');
            if (!admin) {
                await User.create({
                    name: 'Admin',
                    email: adminEmail,
                    password: adminPassword,
                    role: adminRole._id,
                });
                console.log(`Default admin user seeded: ${adminEmail} / ${adminPassword}`);
            } else {
                // Force ensure admin is not deleted and has correct role
                let needsSave = false;
                if (admin.isDeleted) {
                    admin.isDeleted = false;
                    admin.deletedAt = undefined;
                    needsSave = true;
                }
                if (admin.role.toString() !== adminRole._id.toString()) {
                    admin.role = adminRole._id;
                    needsSave = true;
                }

                // Check if password matches. If not, update it.
                // We use bcrypt.compare to check against the plain text password from .env
                // [DELETED] The password reset logic here was causing user password changes to be 
                // overwritten back to the .env password on every server restart.


                if (needsSave) {
                    await admin.save();
                    console.log(`[Seed] Default admin user (${adminEmail}) synchronized and activated.`);
                }
            }
        }
    } catch (error) {
        console.error('Error seeding roles:', error);
    }
};

export default seedRoles;
