import { redirect } from "next/navigation";
import db from "@/lib/db";
import { initialProfile } from "@/actions/user/initial-profile";
import { InitialModal } from "@/components/modals/initial-modal";
import { SetupWrapper } from "./setUpWrapper";

const SetupPage = async () => {
  const profile = await initialProfile();

  if (!profile) {
    return redirect("/login");
  }

  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          userId: profile.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return <SetupWrapper />;
};

export default SetupPage;
