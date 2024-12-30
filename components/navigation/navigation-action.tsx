"use client";

import { Plus } from "lucide-react";
import { ActionTooltip } from "../action-tooltip";
import { useModalStore } from "@/hooks/use-modal-store";

function NavigationAction() {
  const { onOpen } = useModalStore();

  return (
    <div>
      <ActionTooltip side="right" align="center" label="Create a server">
        <span
          className="group flex items-center"
          onClick={() => onOpen("createServer")}
        >
          <span className="flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500">
            <Plus
              className="group-hover:text-white transition text-emerald-500"
              size={25}
            />
          </span>
        </span>
      </ActionTooltip>
    </div>
  );
}

export default NavigationAction;
