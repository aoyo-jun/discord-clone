"use client";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// Documentation on the Dialog component: https://ui.shadcn.com/docs/components/dialog
// Documentation on the Button component: https://ui.shadcn.com/docs/components/button

// Creates the modal for the delete server function
export const DeleteServerModal = () => {
    // Imports the useModal functions
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();

    // if the type is "deleteServer" opens modal
    const isModalOpen = isOpen && type === "deleteServer";
    // Gets the server data
    const { server } =  data;

    const [isLoading, setIsLoading] = useState(false);
    
    // Deletes the server though axios
    const onClick = async () => {
        try {
            setIsLoading(true);

            await axios.delete(`/api/servers/${server?.id}`);

            onClose();

            router.refresh();
            router.push("/");
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Delete Server
                    </DialogTitle>
                    {/* Warning message */}
                    <DialogDescription className="text=center text-zinc-500">
                        Are you sure you want to do this? <br />
                        <span className="text-indigo-500 font-semibold">{server?.name}</span> will be permanently <span className="text-rose-500 font-bold">deleted</span>.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button disabled={isLoading} onClick={onClose} variant="ghost">
                            Cancel
                        </Button>
                        <Button disabled={isLoading} onClick={onClick} variant="primary">
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}