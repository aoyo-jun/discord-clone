import { PrismaClient } from "@prisma/client";

// Documentation on the PrismaClient: https://www.prisma.io/docs/concepts/components/prisma-client (Hot reload hack not on this link)

// Declaring a global var to escape the module scope
declare global {
    // Declaring the 'prisma' variable of type PrismaClient and undefined
    var prisma: PrismaClient | undefined;
};

// Hot reload hack for development (in production, the line 'globalThis.prisma' will be "deleted")
// if 'globalThis.prisma' is not used, everytime the code is changed in the project a new PrismaClient would be initialized
export const db = globalThis.prisma || new PrismaClient();

// While not in production mode, the 'globalThis.prisma' will be used
if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = db;
}