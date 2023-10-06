import { generateComponents } from "@uploadthing/react";
 
import type { OurFileRouter } from "@/app/api/uploadthing/core";

// Documentation on UploadThing Components (Step 3): https://docs.uploadthing.com/nextjs/appdir

export const { UploadButton, UploadDropzone, Uploader } =
  generateComponents<OurFileRouter>();