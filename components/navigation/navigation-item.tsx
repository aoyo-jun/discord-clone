"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooltip";

// Documentation on useParams: https://nextjs.org/docs/app/api-reference/functions/use-params
// Documentation on useRouter: https://nextjs.org/docs/pages/api-reference/functions/use-router

// Explanation on interface: https://www.typescriptlang.org/docs/handbook/interfaces.html
interface NavigationItemProps {
    id: string;
    imageUrl: string;
    name: string;
};

// Creates a NavigationItem referencing NavigationItemProps
export const NavigationItem = ({
    id,
    imageUrl,
    name
}: NavigationItemProps) => {
    const params = useParams();
    const router = useRouter();

    const onClick = () => {
        // Redirects to the clicked server
        router.push(`/servers/${id}`);
    }

    return (
        // Creates the item for the navigation sidebar
        // ActionTooltip wraps the entire thing
        <ActionTooltip side="right" align="center" label={name}>
            <button onClick={onClick} className="group relative flex items-center">
                {/* The little indicator at the left of the servers */}
                {/* Using params to check if the server hovered is the current server */}
                <div className={cn(
                    "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
                    params?.serverId !== id && "group-hover:h-[20px]",
                    params?.serverId === id ? "h-[36px]" : "h-[8px]"
                )} />
                {/* The server icon */}
                {/* Using params to check if the server is the current server to change icon shape */}
                <div className={cn(
                    "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
                    params?.serverId === id && "bg-primary/10 text-primary rounded-[16px]"
                )}>
                    <Image fill src={imageUrl} alt="Channel" />
                </div>
            </button>
        </ActionTooltip>
    )
}