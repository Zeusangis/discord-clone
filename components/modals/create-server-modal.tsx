"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createDiscordServer } from "@/actions/discordserver/server";
import { uploadImage } from "@/utils/upload";
import { useModalStore } from "@/hooks/use-modal-store";

export const CreateServerModel = () => {
  const { isOpen, onClose, type } = useModalStore();
  const isModalOpen = isOpen && type === "createServer";
  const [serverName, setServerName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".gif"],
    },
    maxFiles: 1,
    disabled: isLoading,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!serverName.trim()) {
        throw new Error("Server name is required");
      }

      if (!imageFile) {
        throw new Error("Server image is required");
      }

      // Upload the image
      const formData = new FormData();
      formData.append("file", imageFile);
      const uploadResponse = await uploadImage(formData);
      if (!uploadResponse.fileUrl) {
        throw new Error("Failed to upload image");
      }

      // Create the server
      const createServerResponse = await createDiscordServer(
        serverName,
        uploadResponse.fileUrl
      );
      if (!createServerResponse?.success) {
        throw new Error("Failed to create server");
      }
      router.refresh();
      setServerName("");
      setImageFile(null);
      setImagePreview(null);
      onClose();
    } catch (error) {
      console.error("Submit error:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Customize your server
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your new server a personality with a name and an image. You can
            always change them later.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-8 px-6">
            <div className="flex items-center justify-center text-center">
              <div className="w-full">
                <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                  Server Image
                </Label>
                {imagePreview && (
                  <div className="relative w-32 h-32 mt-2 mx-auto">
                    <Image
                      src={imagePreview}
                      alt="Server Image"
                      layout="fill"
                      objectFit="cover"
                      className="object-cover rounded-full"
                    />
                    <button
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-1 right-1 p-1.5 bg-red-600 text-white rounded-full"
                    >
                      <X className="h-4 w-4 text-white" />
                    </button>
                  </div>
                )}
                {!imagePreview && (
                  <div
                    {...getRootProps()}
                    className={`mt-2 w-full h-60 relative bg-gray-50 ${
                      !imagePreview ? "border-2 border-dashed" : ""
                    }
                    ${isDragActive ? "border-blue-500" : "border-gray-300"} 
                    ${error ? "border-red-500" : ""}
                    rounded-lg transition-all hover:bg-gray-100 cursor-pointer
                    ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <input {...getInputProps()} />

                    <div className="flex flex-col items-center justify-center h-full px-4 py-6">
                      <Upload
                        className={`h-10 w-10 mb-3 ${
                          error ? "text-red-500" : "text-gray-400"
                        }`}
                      />
                      <p className="text-lg font-semibold text-gray-700">
                        {error ? "Upload Failed" : "DROP FILE HERE"}
                      </p>
                      <p className="text-sm text-gray-500 mt-2 text-center">
                        {error ||
                          "Drag and drop your PNG, JPG, WebP, or SVG images here."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label
                htmlFor="name"
                className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
              >
                Server Name
              </Label>
              <Input
                id="name"
                value={serverName}
                onChange={(e) => setServerName(e.target.value)}
                disabled={isLoading}
                placeholder="Enter server name"
                className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 mt-2"
              />
            </div>
          </div>
          <DialogFooter className="bg-gray-100 px-6 py-4">
            <Button disabled={isLoading} variant="primary" type="submit">
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
