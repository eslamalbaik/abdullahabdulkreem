const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Use the exact URI from .env
const MONGODB_URI = 'mongodb+srv://eslamdv7_db_user:dXSHom5A40BAFGyX@cluster0.dnae73r.mongodb.net/?appName=Cluster0';

const ClientLogoSchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    order: { type: Number, default: 0 },
}, { timestamps: { createdAt: true, updatedAt: false } });

const ClientLogo = mongoose.model('ClientLogo', ClientLogoSchema);

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const count = await ClientLogo.countDocuments();
        if (count === 0) {
            console.log('No logos found. Seeding mock logos...');
            await ClientLogo.create([
                { name: 'Logo 1', image: 'https://placehold.co/200x100?text=Logo+1', order: 1 },
                { name: 'Logo 2', image: 'https://placehold.co/200x100?text=Logo+2', order: 2 },
                { name: 'Logo 3', image: 'https://placehold.co/200x100?text=Logo+3', order: 3 },
                { name: 'Logo 4', image: 'https://placehold.co/200x100?text=Logo+4', order: 4 },
                { name: 'Logo 5', image: 'https://placehold.co/200x100?text=Logo+5', order: 5 },
            ]);
            console.log('Successfully seeded 5 logos.');
        } else {
            console.log(`Found ${count} logos. Skipping seed.`);
        }
    } catch (err) {
        console.error('Seed error:', err);
    } finally {
        await mongoose.connection.close();
        console.log('Disconnected from MongoDB');
    }
}

seed();
