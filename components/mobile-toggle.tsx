import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar"
import { ServerSidebar } from "@/components/server/server-sidebar"

// Documentation on the Sheet component: https://ui.shadcn.com/docs/components/sheet
// Documentation on the Button component: https://ui.shadcn.com/docs/components/button

// Remove the sidebars and add a button to show them again
export const MobileToggle = ({
    serverId
}: {
    serverId: string
}) => {
    return (
        <Sheet>
            <SheetTrigger asChild={true}>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 flex gap-0">
                <div className="w-[72px]">
                    <NavigationSidebar />
                </div>
                <ServerSidebar serverId={serverId} />
            </SheetContent>
        </Sheet>
    )
}