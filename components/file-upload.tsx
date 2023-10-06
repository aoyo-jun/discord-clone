"use client"

import { X } from "lucide-react";
import Image from "next/image";
import { UploadDropzone } from "@/lib/uploadthing";
import "@uploadthing/react/styles.css";

// Documentation on UploadThing: https://docs.uploadthing.com/getting-started
// Explanation on interface: https://www.typescriptlang.org/docs/handbook/interfaces.html
interface FileUploadProps {
    onChange: (url?: string) => void;
    value: string;
    endpoint: "messageFile" | "serverImage";
}

// Creates a FileUpload component referencing FileUploadProps
export const FileUpload = ({
    onChange,
    value,
    endpoint
}: FileUploadProps) => {
    const fileType = value?.split(".").pop();

    // If there's a value (imageUrl) and it's not a PDF file
    if (value && fileType !== "pdf") {
        return (
            // Creates a preview of the image
            <div className="relative h-20 w-20">
                <Image
                    fill
                    src={value}
                    alt="Upload"
                    className="rounded-full"
                />
                {/* Creates the "delete image" button */}
                <button
                    // Returns an empty string, deleting the image
                    onClick={() => onChange("")}
                    className="bg-rose-500 text-white p-1 rounded-full absolute top-0 right-0 shadow-sm"
                    type="button"
                >
                    {/* X icon */}
                    <X className="h-4 w-4" />
                </button>
            </div>
        )
    }

    return (
        // Creates the file dropzone
        // When the file upload is complete, shows the image preview
        <div>
            <UploadDropzone
                endpoint={endpoint}
                onClientUploadComplete={(res) => {
                    onChange(res?.[0].url);
                }}
                onUploadError={(error: Error) => {
                    console.log(error);
                }}
            />
        </div>
    )
}