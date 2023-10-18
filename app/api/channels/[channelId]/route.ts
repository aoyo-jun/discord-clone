import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

// Deletes the selected channel
export async function DELETE(
    req: Request,
    { params }: { params: { channelId: string } }
) {
    try {
        // Awaits current profile
        const profile = await currentProfile();
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

        // If there's no memberId, the memberId is missing
        if (!params.channelId) {
            return new NextResponse("Channel ID Missing", { status: 400 })
        }

        // Deletes the selected channel
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
                    deleteMany: {
                        id: params.channelId,
                        name: {
                            not: "general"
                        }
                    }
                }
            },
        });

        // Responds with the server json object, updating the db
        return NextResponse.json(server);
    } catch (error) {
        console.log("[CHANNEL_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// Edit the selected channel
export async function PATCH(
    req: Request,
    { params }: { params: { channelId: string } }
) {
    try {
        // Awaits current profile
        const profile = await currentProfile();
        // Destructure the req url
        const { searchParams } = new URL(req.url);
        //
        const { name, type } = await req.json();

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

        // If there's no memberId, the memberId is missing
        if (!params.channelId) {
            return new NextResponse("Channel ID Missing", { status: 400 })
        }

        // Channel name cannot be "general"
        if (name === "general") {
            return new NextResponse("Name cannot be 'general'", { status: 400 })
        }

        // Edit the selected channel
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
                    update: {
                        where: {
                            id: params.channelId,
                            NOT: {
                                name: "general"
                            }
                        },
                        data: {
                            name,
                            type
                        }
                    }
                }
            },
        });

        // Responds with the server json object, updating the db
        return NextResponse.json(server);
    } catch (error) {
        console.log("[CHANNEL_ID_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}