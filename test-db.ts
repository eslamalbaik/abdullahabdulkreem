import "dotenv/config";
import mongoose from 'mongoose';
import ProductModel from './server/models/Product.js';

async function main() {
    await mongoose.connect(process.env.MONGODB_URI as string);
    // Get the 5 latest products
    const docs = await ProductModel.find().sort({ createdAt: -1 }).limit(5);
    docs.forEach(d => {
        const o = d.toObject();
        console.log('---');
        console.log('ID:', o._id.toString());
        console.log('Title:', o.title || o.name);
        console.log('Image:', o.image);
        console.log('Images:', JSON.stringify(o.images));
        console.log('Created:', o.createdAt);
    });
    process.exit(0);
}
main();
