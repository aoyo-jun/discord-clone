"use client";

import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import qs from "query-string";

// Documentation on the Schema (Zod): https://zod.dev/?id=basic-usage
// Documentation on the useForm: https://react-hook-form.com/docs/useform
// Documentation on the Dialog component: https://ui.shadcn.com/docs/components/dialog
// Documentation on the Form (React Hook Forms) component: https://ui.shadcn.com/docs/components/form
// Documentation on the Button component: https://ui.shadcn.com/docs/components/button

// Creates an object schema for the form, with the fileUrl
const formSchema = z.object({
    // 'fileUrl' should be a string with a minimum length of 1 character, if not, the warning message will be displayed
    fileUrl: z.string().min(1, {
        message: "Attachment is required."
    })  
});

export const MessageFileModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const { apiUrl, query } = data;
    const router = useRouter();

    const isModalOpen = isOpen && type === 'messageFile';

    const form = useForm({
        // Integrates with the shadcn/ui schema validation library
        resolver: zodResolver(formSchema),
        // Sets the default values of the form
        defaultValues: {
            fileUrl: ""
        }
    });

    const handleClose = () => {
        form.reset();
        onClose();
    }

    // Extracts the loading state from the form to disable the inputs if it is currently submitting a request
    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query
            });

            await axios.post(url, {
                ...values,
                content: values.fileUrl,
            });

            form.reset();
            router.refresh();
            handleClose();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        /* Creates a Dialog component */
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                {/* Creates the header of the Dialog component */}
                <DialogHeader className="pt-8 px-6">
                    {/* Title of the header */}
                    <DialogTitle className="text-2xl text-center font-bold">
                        Add an attachment
                    </DialogTitle>
                    {/* Description of the header */}
                    <DialogDescription className="text-center text-zinc-500">
                        Send a file as a message
                    </DialogDescription>
                </DialogHeader>
                {/* Creates a Form with the form schema*/}
                <Form {...form}>
                    {/* Default HTML form that calls the onSubmit function */}
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            {/* Component to upload the image of the server */}
                            <div className="flex items-center justify-center text-center">
                                {/* FormField to upload the image of the server */}
                                <FormField control={form.control} name="fileUrl" render={({ field}) => (
                                    <FormItem>
                                        {/* Upload component of the FormField */}
                                        <FormControl>
                                            <FileUpload endpoint="messageFile" value={field.value} onChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )}/>
                            </div>
                        </div>
                        {/* Creates the footer of the Dialog component */}
                        <DialogFooter className="bg-gray-100 px-6 py-4">
                            {/* Gets disabled when there is a request currently submitting */}
                            <Button variant="primary" disabled={isLoading}>
                                Send
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}