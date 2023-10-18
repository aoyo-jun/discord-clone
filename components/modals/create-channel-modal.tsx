"use client";

import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChannelType } from "@prisma/client";
import qs from "query-string"
import { useEffect } from "react";

// Documentation on the Schema (Zod): https://zod.dev/?id=basic-usage
// Documentation on the useForm: https://react-hook-form.com/docs/useform
// Documentation on the Dialog component: https://ui.shadcn.com/docs/components/dialog
// Documentation on the Form (React Hook Forms) component: https://ui.shadcn.com/docs/components/form
// Documentation on the Input component: https://ui.shadcn.com/docs/components/input
// Documentation on the Button component: https://ui.shadcn.com/docs/components/button
// Documentation on the Select component: https://ui.shadcn.com/docs/components/select
// Documentation on the query-string: https://www.npmjs.com/package/query-string

// Creates an object schema for the form, with the name and type of the channel
const formSchema = z.object({
    // 'name' should be a string with a minimum length of 1 character and cannot be "general", if not, the warning message will be displayed
    name: z.string().min(1, {
        message: "Channel name is required."
    }).refine(
        name => name !== "general", {
            message: "Channel name cannot 'general'."
        }
    ),
    // 'type' should be an Enum of ChannelType (Prisma)
    type: z.nativeEnum(ChannelType)
});

export const CreateChannelModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();
    const params = useParams();

    // if the type is "createChannel" opens modal
    const isModalOpen = isOpen && type === "createChannel";
    const { channelType } = data;

    const form = useForm({
        // Integrates with the shadcn/ui schema validation library
        resolver: zodResolver(formSchema),
        // Sets the default values of the form
        defaultValues: {
            name: "",
            // Default channel is TEXT
            type: channelType || ChannelType.TEXT
        }
    });

    useEffect(() => {
        if (channelType) {
            form.setValue("type", channelType);
        } else {
            form.setValue("type", ChannelType.TEXT)
        }
    }, [channelType, form]);

    // Extracts the loading state from the form to disable the inputs if it is currently submitting a request
    const isLoading = form.formState.isSubmitting;

    // Creates the channel when onSubmit is triggered
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: "/api/channels",
                query: {
                    serverId: params?.serverId
                }
            });
            
            await axios.post(url, values);

            form.reset();
            router.refresh();
            onClose();
        } catch (error) {
            console.log(error);
        }
    }

    // Closes the modal
    const handleClose = () => {
        form.reset();
        onClose();
    }

    return (
        /* Creates a Dialog component for modal */
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                {/* Creates the header of the Dialog component */}
                <DialogHeader className="pt-8 px-6">
                    {/* Title of the header */}
                    <DialogTitle className="text-2xl text-center font-bold">
                        Create Channel
                    </DialogTitle>
                </DialogHeader>
                {/* Creates a Form with the form schema*/}
                <Form {...form}>
                    {/* Default HTML form that calls the onSubmit function */}
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                    {/* Label of the FormField */}
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                        Channel name
                                    </FormLabel>
                                    {/* Input of the FormField */}
                                    <FormControl>
                                        <Input
                                            /* Gets disabled when there is a request currently submitting */
                                            disabled={isLoading}
                                            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                            placeholder="Enter channel name"
                                            {...field}
                                        />
                                    </FormControl>
                                    {/* Displays the warning message if the name or image is not correct */}
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="type" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                        Channel Type
                                    </FormLabel>
                                    <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-zinc-300/50 border-0 focus:ring-0 
                                            text-black ring-offset-0 focus:ring-offset-0 capitalize outline-none">
                                                <SelectValue placeholder="Select a channel type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(ChannelType).map((type) => (
                                                <SelectItem key={type} value={type} className="capitalize">
                                                    {type.toLowerCase()}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        {/* Creates the footer of the Dialog component */}
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            {/* Gets disabled when there is a request currently submitting */}
                            <Button variant="primary" disabled={isLoading}>
                                Create
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}