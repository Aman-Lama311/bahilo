import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User';

const seed = async (): Promise<void> => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not defined in .env');
  }

  const email = process.env.PLATFORM_OWNER_EMAIL;
  if (!email) {
    throw new Error('PLATFORM_OWNER_EMAIL is not defined in .env');
  }

  const password = process.argv[2];
  if (!password) {
    console.error('Usage: npx tsx src/scripts/seedPlatformOwner.ts <password>');
    process.exit(1);
  }

  await mongoose.connect(uri);

  const existing = await User.findOne({ email, isPlatformOwner: true });
  if (existing) {
    console.log('Platform owner already exists for this email. Aborting.');
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const owner = await User.create({
    name: 'Platform Owner',
    email,
    passwordHash,
    isPlatformOwner: true,
    isSuperAdmin: false,
    permissions: []
    // schoolId intentionally omitted — required() only applies when !isPlatformOwner
  });

  console.log('Platform owner created:', owner.email);
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});