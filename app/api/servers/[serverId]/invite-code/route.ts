import { v4 as uuidv4 } from "uuid";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Updates the server inviteCode to a new one using the uuidv4
export async function PATCH(
    req: Request,
    { params }: { params: { serverId: string } }
) {
    try {
        // Awaits to get the current profile
        const profile = await currentProfile();

        // If there's no profile, the user is unauthorized
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // If there's no server ID, the server ID is missing
        if (!params.serverId) {
            return new NextResponse("Server ID Missing", { status: 400 });
        }

        // Updates the inviteCode in the selected server on the db
        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id,
            },
            data: {
                inviteCode: uuidv4(),
            },
        });

        // Responds with the server json object, updating the db
        return NextResponse.json(server);

    } catch (error) {
        console.log("[SERVER_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}