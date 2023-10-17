import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Deletes the server
export async function DELETE(
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

        // Deletes the selected server on the db
        const server = await db.server.delete({
            where: {
                id: params.serverId,
                profileId: profile.id,
            }
        })
        
        // Responds with the server json object, updating the db
        return NextResponse.json(server);

    } catch (error) {
        console.log("SERVER_ID_DELETE", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// Updates the server name and image
export async function PATCH(
    req: Request,
    { params }: { params: { serverId: string } }
) {
    try {
        // Awaits to get the current profile
        const profile = await currentProfile();
        // Gets the new name and image from the request
        const { name, imageUrl } = await req.json();

        // If there's no profile, the user is unauthorized
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Updates the name and image url in the selected server on the db
        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id,
            },
            data: {
                name,
                imageUrl,
            }
        })
        
        // Responds with the server json object, updating the db
        return NextResponse.json(server);

    } catch (error) {
        console.log("SERVER_ID_PATCH", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}