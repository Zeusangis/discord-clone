"use client";

import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormLabel,
  FormItem,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import uploadFile from "@/actions/fileserver/file";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, { message: "Server name is required" }),
  imageUrl: z.string().url({ message: "Invalid image URL" }),
});

export const InitialModal = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    },
  });

  const router = useRouter();
  const isLoading = form.formState.isSubmitting;

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setUploadError(null);

        try {
          // Create preview immediately for better UX
          const previewUrl = URL.createObjectURL(file);
          setImagePreview(previewUrl);

          // Upload the file
          const response = await uploadFile(file);

          if (!response.image_url) {
            throw new Error("Failed to get image URL from upload");
          }

          // Set the actual uploaded image URL in the form
          form.setValue("imageUrl", response.image_url, {
            shouldValidate: true,
          });
        } catch (error) {
          console.error("Upload error:", error);
          setUploadError(
            error instanceof Error ? error.message : "Failed to upload image"
          );
          setImagePreview(null);
          form.setValue("imageUrl", "", { shouldValidate: true });
        }
      }
    },
    [form]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".gif"],
    },
    maxFiles: 1,
    disabled: isLoading,
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // Handle server creation here
      console.log("Form data:", data);
      await axios.post("/api/servers", data);
      form.reset();
      router.refresh();
      window.location.reload();
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  if (!isMounted) return null;

  return (
    <Dialog open={true}>
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        Server Image
                      </FormLabel>
                      <FormControl>
                        <div
                          {...getRootProps()}
                          className={`w-full h-60 relative bg-gray-50 border-2 border-dashed 
                            ${
                              isDragActive
                                ? "border-blue-500"
                                : "border-gray-300"
                            } 
                            ${uploadError ? "border-red-500" : ""}
                            rounded-lg transition-all hover:bg-gray-100 cursor-pointer
                            ${
                              isLoading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                          <input {...getInputProps()} />
                          {imagePreview ? (
                            <Image
                              src={imagePreview}
                              alt="Server image"
                              fill
                              className="object-cover rounded-lg"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center h-full px-4 py-6">
                              <Upload
                                className={`h-10 w-10 mb-3 
                                  ${
                                    uploadError
                                      ? "text-red-500"
                                      : "text-gray-400"
                                  }`}
                              />
                              <p className="text-lg font-semibold text-gray-700">
                                {uploadError
                                  ? "Upload Failed"
                                  : "DROP FILE HERE"}
                              </p>
                              <p className="text-sm text-gray-500 mt-2 text-center">
                                {uploadError
                                  ? uploadError
                                  : "Drag and drop your PNG, JPG, WebP, or SVG images here."}
                              </p>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Server Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isLoading}
                        placeholder="Enter server name"
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoading} variant="primary" type="submit">
                {isLoading ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
