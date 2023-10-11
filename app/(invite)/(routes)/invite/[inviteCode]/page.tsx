import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

// Just a route used to redirect the user to the server he was invited to
interface inviteCodePageProps {
    params: {
        inviteCode: string;
    };
};

const InviteCodePage = async ({
    params
}: inviteCodePageProps) => {
    // Awaits to get the current profile
    const profile = await currentProfile();

    // If there's no profile, the user is not logged in, returning to the sign in page
    if (!profile) {
        return redirectToSignIn();
    }

    // If there's no invite code, redirect to the home page
    if (!params.inviteCode) {
        return redirect("/");
    }

    // Finds if the user is already part of the server
    const existingServer = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some: {
                    profileId: profile.id,
                }
            }
        }
    });

    // If the user is already in the server, redirect to the server
    if (existingServer) {
        return redirect(`/servers/${existingServer.id}`);
    }

    // If the user is not part of the server, creates a new member of the server with the default GUEST role on the db
    const server = await db.server.update({
        where: {
            inviteCode: params.inviteCode,
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id,
                    }
                ]
            }
        }
    });

    // After that, redirects the new member to the server
    if (server) {
        return redirect(`/servers/${server.id}`);
    }

    return null;
}
 
export default InviteCodePage;