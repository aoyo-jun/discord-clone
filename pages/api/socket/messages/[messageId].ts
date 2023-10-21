import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { MemberRole } from "@prisma/client";
import { NextApiRequest } from "next";

// Handle the edit and delete message function
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo
) {
    // if it is not delete or patch the method is not allowed
    if (req.method !== "DELETE" && req.method !== "PATCH") {
        return res.status(405).json({ error: "Method not allowed" })
    }

    try {
        // Awaits for the current profile (special one for the pages folder)
        const profile = await currentProfilePages(req);
        const { messageId, serverId, channelId } = req.query;
        const { content } = req.body;

        // If there's no profile the user is unauthorized
        if (!profile) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // If there's no server ID, it is missing
        if (!serverId) {
            return res.status(400).json({ error: "Server ID Missing" });
        }

        // If there's no channel ID, it is missing
        if (!channelId) {
            return res.status(400).json({ error: "Channel ID Missing" });
        }
        
        // Finds the server
        const server = await db.server.findFirst({
            where: {
                id: serverId as string,
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            include: {
                members: true
            }
        });

        // If there's no server, it doesn't exists
        if (!server) {
            return res.status(404).json({ error: "Server not found" });
        }

        // Finds the channel
        const channel = await db.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: serverId as string
            }
        })

        // If there's no channel, it doesn't exists
        if (!channel) {
            return res.status(404).json({ error: "Channel not found" });
        }

        // Finds the member
        const member = server.members.find((member) => member.profileId === profile.id);

        // If there's no member, it doesn't exists
        if (!member) {
            return res.status(404).json({ error: "Member not found" });
        }

        // Finds the message
        let message = await db.message.findFirst({
            where: {
                id: messageId as string,
                channelId: channelId as string
            },
            include: {
                member: {
                    include: {
                        profile: true
                    }
                }
            }
        });

        // If there's no message or if the message is deleted, it is not found
        if (!message || message.deleted) {
            return res.status(404).json({ error: "Message not found" });
        }

        const isMessageOwner = message.memberId === member.id;
        const isAdmin = member.role === MemberRole.ADMIN;
        const isModerator = member.role === MemberRole.MODERATOR;
        const canModify = isMessageOwner || isAdmin || isModerator;

        // If the user is not the message owener nor the admin or moderator, cannot modify the message
        if (!canModify) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Deletes the message from the db
        if (req.method === "DELETE") {
            message = await db.message.update({
                where: {
                    id: messageId as string,
                },
                data: {
                    fileUrl: null,
                    content: "This messaged has been deleted.",
                    deleted: true
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                }
            });
        }

        // Edit the message from the db
        if (req.method === "PATCH") {
            if (!isMessageOwner) {
                return res.status(401).json({ error: "Unauthorized" })
            }

            message = await db.message.update({
                where: {
                    id: messageId as string,
                },
                data: {
                    content: content,
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                }
            });
        }

        const updateKey = `chat:${channelId}:messages:update`;

        res?.socket?.server?.io?.emit(updateKey, message);

        // Update the db
        return res.status(200).json(message);

    } catch (error) {
        console.log("[MESSAGE_ID]", error);
        return res.status(500).json({ error: "Internal Error" })
    }
}