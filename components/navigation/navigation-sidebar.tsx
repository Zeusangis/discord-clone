import db from "@/lib/db";
import { currentProfile } from "@/lib/currentProfile";
import NavigationAction from "./navigation-action";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavigationItem } from "./navigation-item";
import { ModeToggle } from "../mode-toggle";
import { User } from "lucide-react";
import { ActionTooltip } from "../action-tooltip";
import { UserTooltip } from "../user-tooltip";
import UserNavAction from "./user-nav-action";

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
      <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md mx-auto w-10" />
      <ScrollArea className="flex-1 w-full">
        {servers.map((server) => (
          <div key={server.id} className="mb-4">
            <NavigationItem
              id={server.id}
              name={server.name}
              imageUrl={server.imageUrl}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="mt-auto flex items-center flex-col gap-y-4">
        <ModeToggle />
      </div>
      <UserNavAction />
    </div>
  );
};
