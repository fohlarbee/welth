import { PrismaClient } from "@/generated/prisma";
declare global {
  var prisma: PrismaClient | undefined
}
let db: PrismaClient;

try {
  db = globalThis.prisma || new PrismaClient();
  // Try a simple query to check connection
  await db.$connect();
  if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = db;
  }
} catch (error) {
  console.error('Could not connect to db:', error);
  throw new Error('Could not connect to db');
}

export { db };