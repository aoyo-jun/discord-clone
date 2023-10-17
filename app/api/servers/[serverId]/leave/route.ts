import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Makes the user leave the server
export async function PATCH(
    req: Request,
    { params }: { params: { serverId: string } }
) {
    try {
        // Awaits current profile
        const profile = await currentProfile();

        // If there's no profile, the user is unauthorized
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // If there's no memberId, the memberId is missing
        if (!params.serverId) {
            return new NextResponse("Server ID Missing", { status: 400 });
        }

        // Makes the user leave
        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: {
                    not: profile.id
                },
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            data: {
                members: {
                    deleteMany: {
                        profileId: profile.id
                    }
                }
            }
        });

        // Responds with the server json object, updating the db
        return NextResponse.json(server);
    } catch (error) {
        console.log("[SERVER_ID_LEAVE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}