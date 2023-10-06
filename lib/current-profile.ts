import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

// Find the current profile of the user
export const currentProfile = async () => {
    const { userId } = auth();

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