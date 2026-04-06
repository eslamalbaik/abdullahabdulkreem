import mongoose from 'mongoose';
import 'dotenv/config';

async function checkProducts() {
  await mongoose.connect(process.env.MONGODB_URI || '');
  console.log('Connected to DB');

  // get all products
  const products = await mongoose.connection.db.collection('products').find({}).toArray();
  products.forEach(p => {
      console.log(`Product: ${p.name || p.title}, image: ${p.image}, imageUrl: ${p.imageUrl}`);
  });

  process.exit(0);
}

checkProducts().catch(console.error);
