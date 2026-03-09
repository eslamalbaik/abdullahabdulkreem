const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MONGODB_URI = 'mongodb+srv://eslamdv7_db_user:dXSHom5A40BAFGyX@cluster0.dnae73r.mongodb.net/?appName=Cluster0';

const ClientLogoSchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    order: { type: Number, default: 0 },
});

const ClientLogo = mongoose.model('ClientLogo', ClientLogoSchema);

async function verify() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Successfully connected to MongoDB.');
        const logos = await ClientLogo.find().sort({ order: 1 });
        console.log(`Found ${logos.length} logos in the "clientlogos" collection.`);
        if (logos.length > 0) {
            console.log('List of logos:');
            logos.forEach(l => console.log(`- ${l.name}: ${l.image} (Order: ${l.order})`));
        }
    } catch (err) {
        console.error('Verification error:', err);
    } finally {
        await mongoose.connection.close();
    }
}

verify();
