// import { PrismaClient } from "@/generated/prisma";
// import { withAccelerate } from '@prisma/extension-accelerate'

// // Define the type of the extended Prisma client
// type ExtendedPrisma = ReturnType<PrismaClient['$extends']>;

// declare global {
// //   eslint-disable-next-line no-var    
//   var prisma: ExtendedPrisma | undefined;
// }

// export const db = globalThis.prisma || new PrismaClient().$extends(withAccelerate());
// if (process.env.NODE_ENV !== "production") globalThis.prisma = db;


// import { PrismaClient } from "@/generated/prisma/edge";

// declare global {
//   var prismaEdge: PrismaClient | undefined;
// }

// export const dbEdge = globalThis.prismaEdge || new PrismaClient();
// if (process.env.NODE_ENV !== "production") globalThis.prismaEdge = dbEdge;



import { PrismaClient } from "@/generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";

const basePrisma = new PrismaClient();

export const db = basePrisma.$extends(withAccelerate());

export type DBClient = typeof db; 

declare global {
  var prisma: typeof db | undefined;
}

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
