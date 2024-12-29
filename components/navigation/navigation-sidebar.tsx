import db from "@/lib/db";
import { currentProfile } from "@/lib/currentProfile";
import NavigationAction from "./navigation-action";

export const NavigationSidebar = async () => {
  const user = await currentProfile();
  if (!user) {
    return <div>Loading...</div>;
  }
  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          userId: user.id,
        },
      },
    },
  });
  return (
    <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] py-3">
      <NavigationAction />
    </div>
  );
};
