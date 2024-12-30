"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UserTooltipProps {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
}

export const UserTooltip = ({
  onClick,
  label,
  children,
  side,
  align,
}: UserTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          onClick={onClick}
          className="cursor-pointer hover:bg-rose-500 transition-all"
        >
          <p className="font-semibold py-2 px-2 capitalize">{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
