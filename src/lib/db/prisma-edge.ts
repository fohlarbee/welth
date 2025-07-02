import { PrismaClient } from "@/generated/prisma/edge";

declare global {
  var prismaEdge: PrismaClient | undefined;
}

export const dbEdge = globalThis.prismaEdge || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalThis.prismaEdge = dbEdge;
