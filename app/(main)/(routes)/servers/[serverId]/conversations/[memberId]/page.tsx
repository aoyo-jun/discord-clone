import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
    params: {
        memberId: string;
        serverId: string;
    },
    searchParams: {
        video?: boolean;
    }
}

// Conversation Page
const MemberIdPage = async ({
    params,
    searchParams
}: MemberIdPageProps) => {
    // Awaits current profile
    const profile = await currentProfile();

    // If there's no profile, the user is unauthorized
    if (!profile) {
        return redirectToSignIn();
    }

    // Gets the current member
    const currentMember = await db.member.findFirst({
        where: {
            serverId: params.serverId,
            profileId: profile.id
        },
        include: {
            profile: true
        }
    });

    if (!currentMember) {
        return redirect("/");
    }
 
    // currentMember is the user that clicked on the another user params.memberId
    const conversation = await getOrCreateConversation(currentMember.id, params.memberId);

    if (!conversation) {
        return redirect(`/servers/${params.serverId}`)
    }

    const generalChannel = await db.channel.findFirst({
        where: {
            name: "general"
        }
    })

    if (!generalChannel) {
        redirect("/");
    }

    const { memberOne, memberTwo } = conversation;

    // Get the other member comparing the current member with the member one extracted from the conversation
    const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader imageUrl={otherMember.profile.imageUrl} serverId={params.serverId} name={otherMember.profile.name} type="conversation" />
            {searchParams.video && (
                <MediaRoom
                    chatId={conversation.id}
                    video={true}
                    audio={true}
                    params={{
                        serverId: params.serverId,
                        channelId: generalChannel.id
                    }}
                />
            )}
            {!searchParams.video && (
                <>
                    <ChatMessages
                        member={currentMember}
                        name={otherMember.profile.name}
                        chatId={conversation.id}
                        type="conversation"
                        apiUrl="/api/direct-messages"
                        paramKey="conversationId"
                        paramValue={conversation.id}
                        socketUrl="/api/socket/direct-messages"
                        socketQuery={{
                            conversationId: conversation.id,
                        }}
                    />
                    <ChatInput
                        name={otherMember.profile.name}
                        type="conversation"
                        apiUrl="/api/socket/direct-messages"
                        query={{
                            conversationId: conversation.id
                        }}
                    />
                </>
            )}
        </div>
    );
}
 
export default MemberIdPage;