import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { MemberRole } from "@prisma/client";
import { NextApiRequest } from "next";

// Handle the edit and delete direct message function
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
        const { directMessageId, conversationId } = req.query;
        const { content } = req.body;

        // If there's no profile the user is unauthorized
        if (!profile) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // If there's no conversation ID, it is missing
        if (!conversationId) {
            return res.status(400).json({ error: "Conversation ID Missing" });
        }

        // Finds the conversation on the db
        const conversation = await db.conversation.findFirst({
            where: {
                id: conversationId as string,
                OR: [
                    {
                        memberOne: {
                            profileId: profile.id
                        },
                    },
                    {
                        memberTwo: {
                            profileId: profile.id
                        },
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
        })

        // If there's no conversation, it doesn't exists
        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }

        // Finds the member
        const member = conversation.memberOne.profileId === profile.id ? conversation.memberOne : conversation.memberTwo;

        // If there's no member, it doesn't exists
        if (!member) {
            return res.status(404).json({ error: "Member not found" });
        }

        // Finds the direct message on the db
        let directMessage = await db.directMessage.findFirst({
            where: {
                id: directMessageId as string,
                conversationId: conversationId as string
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
        if (!directMessage || directMessage.deleted) {
            return res.status(404).json({ error: "Message not found" });
        }

        const isMessageOwner = directMessage.memberId === member.id;
        const isAdmin = member.role === MemberRole.ADMIN;
        const isModerator = member.role === MemberRole.MODERATOR;
        const canModify = isMessageOwner || isAdmin || isModerator;

        // If the user is not the message owener nor the admin or moderator, cannot modify the message
        if (!canModify) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Deletes the message from the db
        if (req.method === "DELETE") {
            directMessage = await db.directMessage.update({
                where: {
                    id: directMessageId as string,
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

            directMessage = await db.directMessage.update({
                where: {
                    id: directMessageId as string,
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

        const updateKey = `chat:${conversationId}:messages:update`;

        res?.socket?.server?.io?.emit(updateKey, directMessage);

        // Update the db
        return res.status(200).json(directMessage);

    } catch (error) {
        console.log("[DIRECT_MESSAGE_ID]", error);
        return res.status(500).json({ error: "Internal Error" })
    }
}