import { ChatHeader } from "@/components/chat/chat-header";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
    params: {
        memberId: string;
        serverId: string;
    }
}

const MemberIdPage = async ({
    params
}: MemberIdPageProps) => {
    // Awaits current profile
    const profile = await currentProfile();

    // If there's no profile, the user is unauthorized
    if (!profile) {
        return redirectToSignIn();
    }

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

    const { memberOne, memberTwo } = conversation;

    // Get the other member comparing the current member with the member one extracted from the conversation
    const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

    return (
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader imageUrl={otherMember.profile.imageUrl} serverId={params.serverId} name={otherMember.profile.name} type="conversation" />
        </div>
    );
}
 
export default MemberIdPage;