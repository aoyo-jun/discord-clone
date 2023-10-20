import { getAuth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextApiRequest } from "next";

// Find the current profile of the user (used for the pages folder)
export const currentProfilePages = async (req: NextApiRequest) => {
    const { userId } = getAuth(req);

    // If there's no userId, returns null
    if (!userId) {
        return null;
    }

    // Awaits to get the current profile from the database
    const profile = await db.profile.findUnique({
        where: {
            userId
        }
    })

    return profile;
}