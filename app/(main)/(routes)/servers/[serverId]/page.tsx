import { MobileToggle } from "@/components/mobile-toggle";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const ServerIdPage = async ({
    params
}: {
    params: { serverId: string }
}) => {

    const server = await db.server.findUnique({
        where: {
            id: params.serverId,
        }
    })

    if (!server) {
        return redirect("/");
    }

    return (
        <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
            {/* Triggers if on mobile device */}
            <MobileToggle serverId={server.id} />
            <p className="font-semibold text-md text-black dark:text-white">
                {server.name}
            </p>
        </div>
    );
}

export default ServerIdPage;