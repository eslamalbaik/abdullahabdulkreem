import mongoose from 'mongoose';
import 'dotenv/config';

async function cleanup() {
  await mongoose.connect(process.env.MONGODB_URI || '');
  console.log('Connected to DB');

  // Delete all products that have no image (broken data)
  const result = await mongoose.connection.db.collection('products').deleteMany({
    $and: [
      { image: { $in: [null, undefined, ''] } },
      { imageUrl: { $in: [null, undefined, ''] } }
    ]
  });
  console.log(`Deleted ${result.deletedCount} products with no image`);

  // Show remaining products
  const remaining = await mongoose.connection.db.collection('products').find({}).toArray();
  console.log(`Remaining products: ${remaining.length}`);
  remaining.forEach(p => {
    console.log(`  - ${p.name}: image=${p.image}, imageUrl=${p.imageUrl}`);
  });

  await mongoose.disconnect();
  process.exit(0);
}

cleanup().catch(console.error);
