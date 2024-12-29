"use client";

import { User } from "lucide-react";
import { UserTooltip } from "../user-tooltip";

const UserNavAction = () => {
  return (
    <div>
      <UserTooltip
        onClick={() => {
          console.log("object");
        }}
        side="right"
        align="center"
        label="Logout"
      >
        <span className="group flex items-center ">
          <span className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
            <User
              className="group-hover:text-white transition text-emerald-500"
              size={25}
            />
          </span>
        </span>
      </UserTooltip>
    </div>
  );
};

export default UserNavAction;
