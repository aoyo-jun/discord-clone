import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ServerSidebar } from "@/components/server/server-sidebar";

// This is the layout for the main page of the server
// Children is the main page
const ServerIdLayout = async ({
    children,
    params,
}: {
    children: React.ReactNode;
    params: { serverId: string }
}) => {
    // Awaits to find the profile
    const profile = await currentProfile();

    // If the profile is not found redirects to Log in page
    if (!profile) {
        return redirectToSignIn();
    }

    // Awaits to find the server by the id and checks if the user is on the server
    const server = await db.server.findUnique({
        where: {
            id: params.serverId,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    })

    // If the server is not found redirects to the home page
    if (!server) {
        return redirect("/");
    }

    return ( 
        <div className="h-full">
            <div className="md:Flex h-full w-60 z-20 flex-col fixed inset-y-0">
                {/* Loads the Sidebar according to the server Id */}
                <ServerSidebar serverId={params.serverId} />
            </div>
            <main className="h-full md:pl-60">
                {children}
            </main>
        </div>
    );
}
 
export default ServerIdLayout;