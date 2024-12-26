"use client";
import { UploadButton, UploadDropzone } from "@/utils/uploadthing";
import React from "react";
const Uploader = () => {
  return (
    <UploadDropzone
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        alert("Upload Completed");
      }}
      onUploadError={(error: Error) => {
        alert(`ERROR! ${error.message}`);
      }}
    />
  );
};

export default Uploader;
