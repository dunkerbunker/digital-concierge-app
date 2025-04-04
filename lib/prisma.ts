// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Declare a global variable to hold the Prisma client instance
// This prevents creating multiple instances in development due to hot reloading
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Initialize Prisma Client
const prisma = global.prisma || new PrismaClient({
  // log: ['query'], // Optional: Log Prisma queries
});

// Assign to global variable in development
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Export the initialized client as the default export
export default prisma; // <--- Make sure you have this export