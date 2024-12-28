import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getSession } from "next-auth/react";
import { SessionResponseType } from "@/types/sessionType";

const f = createUploadthing();
const handleAuth = async () => {
  const session: SessionResponseType = await getSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return { id: session.id };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  serverImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
  messageFile: f(["image", "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
