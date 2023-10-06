"use client";

import { CreateServerModal } from "@/components/modals/create-server-modal";
import { useEffect, useState } from "react";

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
        </>
    )
}