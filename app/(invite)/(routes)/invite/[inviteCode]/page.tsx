import { currentProfile } from "@/lib/currentProfile";
import { redirect } from "next/navigation";
import db from "@/lib/db";

interface InvitePageProps {
  params: { inviteCode: string };
}

const InvitePage = async ({ params }: InvitePageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/login");
  }

  if (!params.inviteCode) {
    return redirect("/");
  }

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          userId: profile.id,
        },
      },
    },
  });

  if (existingServer) {
    return redirect(`/servers/${existingServer.id}`);
  }

  const server = await db.server.findFirst({
    where: {
      inviteCode: params.inviteCode,
    },
  });

  if (!server) {
    return redirect("/");
  }

  const member = await db.member.create({
    data: {
      userId: profile.id,
      serverId: server.id,
    },
  });

  if (member) {
    return redirect(`/servers/${server.id}`);
  }

  return null;
};

export default InvitePage;
