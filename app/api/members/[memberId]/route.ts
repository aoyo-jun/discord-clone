import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

// Removes the member from a server
export async function DELETE(
    req: Request,
    { params }: { params: { memberId: string } }
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
        if (!params.memberId) {
            return new NextResponse("Member ID Missing", { status: 400 })
        }

        // Remove the selected member
        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            },
            data: {
                members: {
                    deleteMany: {
                        id: params.memberId,
                        profileId: {
                            not: profile.id
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: "asc"
                    }
                }
            }
        });

        // Responds with the server json object, updating the db
        return NextResponse.json(server);
    } catch (error) {
        console.log("[MEMBERS_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}

// Changes the role of the targeted user
export async function PATCH(
    req: Request,
    { params }: { params: { memberId: string } }
) {
    try {
        // Awaits current profile
        const profile = await currentProfile();
        // Destructure the req url
        const { searchParams } = new URL(req.url);
        // Destructure the req to get the role the user is going to be updated to
        const { role } = await req.json();

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
        if (!params.memberId) {
            return new NextResponse("Member ID Missing", { status: 400 })
        }

        // Updates the role of the member
        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            },
            data: {
                members: {
                    update: {
                        where: {
                            id: params.memberId,
                            profileId: {
                                not: profile.id
                            }
                        },
                        data: {
                            role
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: "asc"
                    }
                }
            }
        });

        // Responds with the server json object, updating the db
        return NextResponse.json(server);
    } catch (error) {
        console.log("[MEMBERS_ID_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}