import { InitialModal } from "@/components/modals/initial-modal";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";

const SetupPage = async () => {
    // Awaits the initial profile to load the page
    const profile = await initialProfile();

    // Awaits to check the first profile ID in the db that matches the current profile ID
    const server = await db.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    // When it finds the correct server the user gets redirected
    if (server) {
        return redirect(`/servers/${server.id}`);
    }

    // Loads the initial modal
    return (
        <div>
            <InitialModal />
        </div>
    )
}
 
export default SetupPage;