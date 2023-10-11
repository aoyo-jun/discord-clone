"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useOrigin } from "@/hooks/use-origin";
import { useState } from "react";
import axios from "axios";

// Documentation on the Dialog component: https://ui.shadcn.com/docs/components/dialog
// Documentation on the Label component: https://ui.shadcn.com/docs/components/label
// Documentation on the Input component: https://ui.shadcn.com/docs/components/input
// Documentation on the Button component: https://ui.shadcn.com/docs/components/button

// Creates the modal for the invite function
export const InviteModal = () => {
    // Imports the useModal functions
    const { onOpen, isOpen, onClose, type, data } = useModal();
    // Gets the current URL of the site (aka localhost:3000)
    const origin = useOrigin();

    // if the type is "invite" opens modal
    const isModalOpen = isOpen && type === "invite";
    // Gets the server data, used to get the server inviteCode
    const { server } =  data;

    // States "copied" and "isLoading"
    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Creates the invite URL
    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

    // Copies the inviteURL to the clipboard of the user and after 1000ms sets the setCopied to false again, updating the state
    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    // Updates the invite URL
    const onNew = async () => {
        try {
            // Disables the input and buttons while loading
            setIsLoading(true);
            // Generates the new invite URL
            const response = await axios.patch(`/api/servers/${server?.id}/invite-code`)

            // Changes the invite URL using the onOpen function
            onOpen("invite", { server: response.data })
        } catch (error) {
            console.log(error);
        } finally {
            // Enables the input and buttons again after loading is completed
            setIsLoading(false);
        }
    }
    
    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Invite Friends
                    </DialogTitle>
                </DialogHeader>
                <div className="p-6">
                    <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        Server Invite Link
                    </Label>
                    <div className="flex items-center mt-2 gap-x-2">
                        <Input
                            disabled={isLoading}
                            value={inviteUrl}
                            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        />
                        <Button disabled={isLoading} onClick={onCopy} size="icon">
                            {copied
                                ? <Check className="w-4 h-4" />
                                : <Copy className="w-4 h-4" />
                            }
                        </Button>
                    </div>
                    <Button
                        onClick={onNew}
                        disabled={isLoading}
                        variant="link"
                        size="sm"
                        className="text-xs text-zinc-500 mt-4"
                    >
                        Generate a new link
                        <RefreshCw className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}