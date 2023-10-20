"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus, Smile } from "lucide-react";

// Documentation on the Form component: https://ui.shadcn.com/docs/components/form
// Documentation on the Input component: https://ui.shadcn.com/docs/components/input

interface ChatInputProps {
    apiUrl: string;
    query: Record<string, any>;
    name: string;
    type: "channel" | "conversation";
}

// Form Schema for the messages
const formSchema = z.object({
    content: z.string().min(1),
});

// Creates the input for the chat messages
export const ChatInput = ({
    apiUrl,
    query,
    name,
    type
}: ChatInputProps) => {
    // Creates the form with a blank default value
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: ""
        }
    });

    // Is loading if the form is submitting
    const isLoading = form.formState.isSubmitting;

    // Subsmits the form using axios
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const url = qs.stringifyUrl({
                url: apiUrl,
                query,
            });

            await axios.post(url, values);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField control={form.control} name="content" render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <div className="relative p-4 pb-6">
                                {/* File attachment Button */}
                                <button
                                    type="button"
                                    onClick={() => {}}
                                    className="absolute top-7 left-8 h-[24px] w-[24px] bg-zinc-500
                                    dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300
                                    transition rounded-full p-1 flex items-center justify-center"
                                >
                                    <Plus className="text-white dark:text-[#313338]" />
                                </button>
                                {/* Chat Input */}
                                <Input
                                    disabled={isLoading}
                                    className="px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75
                                    border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0
                                    text-zinc-600 dark:text-zinc-200"
                                    placeholder={`Message ${type === "conversation" ? name : "#" + name}`}
                                    {...field}
                                />
                                {/* Emoji Button     */}
                                <div className="absolute top-7 right-8">
                                    <Smile />
                                </div>
                            </div>
                        </FormControl>
                    </FormItem>
                )} />
            </form>
        </Form>
    )
}