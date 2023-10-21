import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { DirectMessage } from "@prisma/client";
import { NextResponse } from "next/server";

// How many messages will be loaded at a time
const MESSAGES_BATCH = 10;

// Get the messages from the db
export async function GET(
    req: Request
) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const cursor = searchParams.get("cursor");
        const conversationId = searchParams.get("conversationId");

        // If there's no profile, the user is unauthorized
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // If there's no conversation ID, it is missing
        if (!conversationId) {
            return new NextResponse("Conversation ID Missing", { status: 400 });
        }

        // Store the direct messages
        let messages: DirectMessage[] = [];

        if (cursor) {
            messages = await db.directMessage.findMany({
                take: MESSAGES_BATCH,
                skip: 1,
                cursor: {
                    id: cursor,
                },
                where: {
                    conversationId: conversationId,
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            });
        } else {
            messages = await db.directMessage.findMany({
                take: MESSAGES_BATCH,
                where: {
                    conversationId: conversationId
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            });
        }

        let nextCursor = null;

        // If the messages.length !== MESSAGES_BATCH it reached the end of the infinite load
        if (messages.length === MESSAGES_BATCH) {
            nextCursor = messages[MESSAGES_BATCH - 1].id;
        }

        return NextResponse.json({
            items: messages,
            nextCursor
        });
        
    } catch (error) {
        console.log("[DIRECT_MESSAGES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}