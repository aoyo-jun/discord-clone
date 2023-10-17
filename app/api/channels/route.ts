import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

// Creates the channel on the db
export async function POST(
    req: Request
) {
    try {
        // Awaits current profile
        const profile = await currentProfile();
        // Destructure the req in name and type
        const { name, type } = await req.json();
        // Destructure the req url
        const { searchParams } = new URL(req.url);

        // Gets the serverId though the searchParams
        const serverId = searchParams.get("serverId");

        // If there's no profile, the user is unauthorized
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // If there's no serverId, the serverId is missing
        if (!serverId) {
            return new NextResponse("Server ID Missing", { status: 400 });
        }

        // Checks if the name of the channel isn't "general"
        if (name === "general") {
            return new NextResponse("Name cannot be 'general'", { status: 400 })
        }

        // Creates the channel on the selected server if the user is an admin or moderator
        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    create: {
                        profileId: profile.id,
                        name,
                        type,
                    }
                }
            }
        });

        // Responds with the server json object, updating the db
        return NextResponse.json(server);
    } catch (error) {
        console.log("CHANNELS_POST", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}