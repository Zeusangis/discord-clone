import { initialProfile } from "@/actions/user/initial-profile";
import { UserType } from "@/types/userType";
import db from "@/lib/db";
import React from "react";
import { redirect } from "next/navigation";
import { InitialModal } from "@/components/modals/initial-modal";
const SetupPage = async () => {
  const user: UserType = await initialProfile();
  if (!user) {
    return;
  }
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          id: user.id,
        },
      },
    },
  });
  if (server) {
    return redirect(`/server/${server.id}`);
  }
  return (
    <div>
      <InitialModal />
    </div>
  );
};

export default SetupPage;
