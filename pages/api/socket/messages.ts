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
        const { serverId, channelId } = req.query;

        // If there's no profile, the user is unauthorized
        if (!profile) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // If there's no server ID, it is missing
        if (!serverId) {
            return res.status(400).json({ error: "Server ID missing" });
        }

        // If there's no channel ID, it is missing
        if (!channelId) {
            return res.status(400).json({ error: "Channel ID missing" });
        }

        // If there's no content (message), it is missing
        if (!content) {
            return res.status(400).json({ error: "Content missing" });
        }

        // Gets the server the message is being posted from the db
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

        // If there's no server it doesn't exist
        if (!server) {
            return res.status(404).json({ message: "Server not found" });
        }

        // Gets the channel the message is being posted from the db
        const channel = await db.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: serverId as string,
            }
        });

        // If there's no channel it doesn't exist
        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        // Get the member that sent the message
        const member = server.members.find((member) => member.profileId === profile.id);

        // If there's no member, it is missing
        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        // Creates the message on the db
        const message = await db.message.create({
            data: {
                content,
                fileUrl,
                channelId: channelId as string,
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

        const channelKey = `chat:${channelId}:messages`;

        res?.socket?.server?.io?.emit(channelKey, message);

        // Returns the message
        return res.status(200).json(message);

    } catch (error) {
        console.log("MESSAGES_POST", error);
        return res.status(500).json({ messages: "Internal Error" });
    }
}