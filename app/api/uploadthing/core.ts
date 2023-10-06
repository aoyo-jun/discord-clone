import { auth } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";

// Documentation on UploadThing: https://docs.uploadthing.com/nextjs/appdir

const f = createUploadthing();

// Handles the authorization with Clerk
const handleAuth = () => {
    const { userId } = auth();
    if (!userId) throw new Error("Unauthorized");
    return { userId: userId };
}

// FileRouter for the app
export const ourFileRouter = {
    serverImage: f({ image: {maxFileSize: "4MB", maxFileCount: 1} })
        // Uses the middleware to check authorization
        .middleware(() => handleAuth())
        // Usually logs the userId and the fileUrl but not now
        .onUploadComplete(() => {}),
    messageFile: f(["image", "pdf"])
        // Uses the middleware to check authorization
        .middleware(() => handleAuth())
        // Usually logs the userId and the fileUrl but not now
        .onUploadComplete(() => {})
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;