import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import { ServerHeader } from "./server-header";

interface ServerSidebarProps {
    serverId: string;
}

// Receives the serverId using the ServerSidebarProps
export const ServerSidebar = async ({
    serverId
}: ServerSidebarProps) => {
    // Awaits to find the profile
    const profile = await currentProfile();

    // If the profile is not found redirects to the home page
    if (!profile) {
        return redirect("/");
    }

    // Awaits to find the server by the id and grabs the channels and members
    const server = await db.server.findUnique({
        where: {
            id: serverId,
        },
        include: {
            channels: {
                orderBy: {
                    createdAt: "asc",
                },
            },
            members: {
                include: {
                    profile: true,
                },
                orderBy: {
                    role: "asc",
                }
            }
        }
    });

    // Filters the channels by type
    const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT);
    const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO);
    const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO);

    // Gets the current members of the server excluding the current user
    const members = server?.members.filter((member) => member.profileId !== profile.id);

    // If the server is not found redirects to the home page
    if (!server) {
        return redirect("/");
    }

    // Sets the role of the user
    const role = server.members.find((member) => member.profileId === profile.id)?.role;

    return (
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
            <ServerHeader server={server} role={role} />
        </div>
    )
}