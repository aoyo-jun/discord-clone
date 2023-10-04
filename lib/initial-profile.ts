import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";

export const initialProfile = async () => {
    // Attempts to get the current user using Clerk
    const user = await currentUser();

    // If there's no user, then we're not logged in so it redirects to the Sign in page
    if (!user) {
        return redirectToSignIn();
    }

    // Attempts to find the profile connected to the logged in user though the user ID
    const profile = await db.profile.findUnique({
        where: {
            userId: user.id
        }   
    });

    // If the profile exists, returns the profile
    if (profile) {
        return profile;
    }

    // If the profile is not found, a new profile is created on the database
    const newProfile = await db.profile.create({
        data: {
            userId: user.id,
            name: `${user.firstName} ${user.lastName}`,
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress
        }
    });
    
    // After the new profile is created, returns the new profile
    return newProfile;
};
