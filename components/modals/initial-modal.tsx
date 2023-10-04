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
        <Dialog open={true}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Customize your server
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        Give your server a personality with a name and an image. You can always change it later.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                TODO: Image Upload
                            </div>

                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                        Server name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                            placeholder="Enter server name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                        </div>
                        <DialogFooter className="bg-gray-100 px-6 py-4">
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