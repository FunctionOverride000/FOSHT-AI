import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  // 1. Buat Pool koneksi ke database Neon Anda
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  // 2. Bungkus Pool tersebut ke dalam Adapter Prisma 7
  const adapter = new PrismaPg(pool);
  
  // 3. Masukkan adapter ke dalam Prisma Client
  return new PrismaClient({ adapter });
};

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

export default prisma;