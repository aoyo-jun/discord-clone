"use client";

import { useEffect, useState } from "react";
import { CreateServerModal } from "@/components/modals/create-server-modal";
import { InviteModal } from "@/components/modals/invite-modal";
import { EditServerModal } from "@/components/modals/edit-server-modal";

export const ModalProvider = () => {
    // Checks if the modal is mounted (assembled) to avoid hydration errors
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // If it is not mounted returns null
    if (!isMounted) {
        return null;
    }

    return (
        // Returns the modal
        <>
            <CreateServerModal />
            <InviteModal />
            <EditServerModal />
        </>
    )
}