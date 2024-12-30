"use client";

import { User } from "lucide-react";
import { UserTooltip } from "@/components/user-tooltip";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/actions/auth/auth";

const UserNavAction = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logout();
      router.push("/login"); // Redirect to login page after logout
      router.refresh(); // Refresh the current route
    } catch (error) {
      console.error("Logout failed:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <UserTooltip
        onClick={() => {
          handleLogout();
        }}
        side="right"
        align="center"
        label="Logout"
      >
        <span className="group flex items-center ">
          <span className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-rose-500">
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
