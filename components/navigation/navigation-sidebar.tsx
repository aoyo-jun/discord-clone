import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { NavigationAction } from "./navigation-action";
import { Separator } from "@/components//ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModeToggle } from "@/components/mode-toggle";
import { NavigationItem } from "./navigation-item";
import { UserButton } from "@clerk/nextjs";

// Documentation on Separator: https://ui.shadcn.com/docs/components/separator
// Documentation on ScrollArea: https://ui.shadcn.com/docs/components/scroll-area
// Documentation on ModeToggle: https://ui.shadcn.com/docs/dark-mode/next

export const NavigationSidebar = async () => {
    // Awaits profile to load
    const profile = await currentProfile();

    // If there's no profile, redirects to homepage
    if (!profile) {
        return redirect("/");
    }

    // Checks what servers the profile is in
    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    return (
        <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] py-3 relative" >
            {/* NavigationAction is the create server button */}
            <NavigationAction />
            {/* Separates the NavigationAction and the servers */}
            <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto" />
            {/* Creates an area that scrolls */}
            <ScrollArea>
                {/* Map every server the profile is in */}
                {servers.map((server) => (
                    <div key={server.id} className="mb-4">
                        {/* Creates a NavigationItem (server icon) */}
                        <NavigationItem id={server.id} imageUrl={server.imageUrl} name={server.name} />
                    </div>
                ))}
            </ScrollArea>
            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4 absolute bottom-0">
                {/* Button to change theme */}
                <ModeToggle />
                {/* User button to log out and change preferences */}
                <UserButton
                    // Redirects to home after log out
                    afterSignOutUrl="/"
                    appearance={{
                        elements: {
                            avatarBox: "h-[48px] w-[48px]"
                        }
                    }}
                />
            </div>
        </div>
    )
}