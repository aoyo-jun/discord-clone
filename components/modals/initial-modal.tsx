"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

// Documentation on the Schema (Zod): https://zod.dev/?id=basic-usage
// Documentation on the useForm: https://react-hook-form.com/docs/useform
// Documentation on the Dialog component: https://ui.shadcn.com/docs/components/dialog
// Documentation on the Form (React Hook Forms) component: https://ui.shadcn.com/docs/components/form
// Documentation on the Input component: https://ui.shadcn.com/docs/components/input
// Documentation on the Button component: https://ui.shadcn.com/docs/components/button

// Creates an object schema for the form, with the name and imageUrl
const formSchema = z.object({
    // 'name' should be a string with a minimum length of 1 character, if not, the warning message will be displayed
    name: z.string().min(1, {
        message: "Server name is required."
    }),
    // 'imageUrl' should be a string with a minimum length of 1 character, if not, the warning message will be displayed
    imageUrl: z.string().min(1, {
        message: "Server image is required."
    })  
});

export const InitialModal = () => {
    // Checks if the modal is mounted (assembled) to avoid hydration errors
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // 
    const form = useForm({
        // Integrates with the shadcn/ui schema validation library
        resolver: zodResolver(formSchema),
        // Sets the default values of the form
        defaultValues: {
            name: "",
            imageUrl: ""
        }
    });

    // Extracts the loading state from the form to disable the inputs if it is currently submitting a request
    const isLoading = form.formState.isSubmitting;

    // Function to log the values (for now)
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
    }

    // If it is not mounted returns null
    if (!isMounted) {
        return null;
    }

    return (
        /* Creates a Dialog component already opened */
        <Dialog open={true}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                {/* Creates the header of the Dialog component */}
                <DialogHeader className="pt-8 px-6">
                    {/* Title of the header */}
                    <DialogTitle className="text-2xl text-center font-bold">
                        Customize your server
                    </DialogTitle>
                    {/* Description of the header */}
                    <DialogDescription className="text-center text-zinc-500">
                        Give your server a personality with a name and an image. You can always change it later.
                    </DialogDescription>
                </DialogHeader>
                {/* Creates a Form with the form schema*/}
                <Form {...form}>
                    {/* Default HTML form that calls the onSubmit function */}
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            {/* Component to upload the image of the server */}
                            <div className="flex items-center justify-center text-center">
                                TODO: Image Upload
                            </div>
                            {/* FormField to write the name of the server */}
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                    {/* Label of the FormField */}
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                        Server name
                                    </FormLabel>
                                    {/* Input of the FormField */}
                                    <FormControl>
                                        <Input
                                            /* Gets disabled when there is a request currently submitting */
                                            disabled={isLoading}
                                            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                            placeholder="Enter server name"
                                            {...field}
                                        />
                                    </FormControl>
                                    {/* Displays the warning message if the name or image is not correct */}
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