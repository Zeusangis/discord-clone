"use client";

import { CreateServerModel } from "@/components/modals/create-server-modal";
import { useEffect, useState } from "react";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    setIsMounted(true);
  }

  return (
    <>
      <CreateServerModel />
    </>
  );
};
