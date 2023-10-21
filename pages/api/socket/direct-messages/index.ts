import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo,
) {
    // Can't be anything but POST requests
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        // Awaits to get the current profile (special one because we're not on the app folder, but in the pages folder)
        const profile = await currentProfilePages(req);
        // Destructures the content (message) and fileUrl (attachment) from the req
        const { content, fileUrl } = req.body;
        // Destructures the serverId and ChannelId from the req
        const { conversationId } = req.query;

        // If there's no profile, the user is unauthorized
        if (!profile) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // If there's no server ID, it is missing
        if (!conversationId) {
            return res.status(400).json({ error: "Conversation ID missing" });
        }

        // If there's no content (message), it is missing
        if (!content) {
            return res.status(400).json({ error: "Content missing" });
        }

        // Gets the conversation from the db
        const conversation = await db.conversation.findFirst({
            where: {
                id: conversationId as string,
                OR: [
                    {
                        memberOne: {
                            profileId: profile.id,
                        }
                    },
                    {
                        memberTwo: {
                            profileId: profile.id
                        }
                    }
                ]
            },
            include: {
                memberOne: {
                    include: {
                        profile: true
                    }
                },
                memberTwo: {
                    include: {
                        profile: true
                    }
                }
            }
        });

        // If there's no conversation, it is missing
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        // Get the member that sent the message
        const member = conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwo;

        // If there's no member, it is missing
        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        // Creates the message on the db
        const message = await db.directMessage.create({
            data: {
                content,
                fileUrl,
                conversationId: conversationId as string,
                memberId: member.id
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        });

        const channelKey = `chat:${conversationId}:messages`;

        res?.socket?.server?.io?.emit(channelKey, message);

        // Returns the message
        return res.status(200).json(message);

    } catch (error) {
        console.log("DIRECT_MESSAGES_POST", error);
        return res.status(500).json({ messages: "Internal Error" });
    }
}