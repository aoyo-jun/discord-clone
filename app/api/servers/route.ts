import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

// Creates the server
export async function POST(req: Request) {
    try {
        // Awaits to get the name and image of the server
        const { name, imageUrl } = await req.json();
        // Awaits to get the current profile
        const profile = await currentProfile();

        // if there's no profile you can't create a server
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Creates the server on the database
        const server = await db.server.create({
            data: {
                profileId: profile.id,
                name: name,
                imageUrl: imageUrl,
                // Generates the random invite code of the server
                inviteCode: uuidv4(),
                channels: {
                    create: [
                        // Generates a default channel
                        { name: "general", profileId: profile.id }
                    ]
                },
                members: {
                    create: [
                        // the user that created the server gets assigned as the Admin of the server
                        { profileId: profile.id, role: MemberRole.ADMIN }
                    ]
                }
            }
        });

        return NextResponse.json(server);
    } catch (error) {
        // If there's an error logs and returns a response to the user
        console.log("[SERVERS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}