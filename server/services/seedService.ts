import Role from '../models/Role.js';
import User from '../models/User.js';

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
        const adminRole = await Role.findOne({ name: 'Admin' });
        if (adminRole) {
            const adminExists = await User.findOne({ email: 'admin@admin.com' });
            if (!adminExists) {
                await User.create({
                    name: 'Admin',
                    email: 'admin@admin.com',
                    password: 'admin123',
                    role: adminRole._id,
                });
                console.log('Default admin user seeded: admin@admin.com / admin123');
            }
        }
    } catch (error) {
        console.error('Error seeding roles:', error);
    }
};

export default seedRoles;
