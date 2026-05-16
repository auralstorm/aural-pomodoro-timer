import type { ReactNode } from "react";

import { AppCard } from "@/components/common/AppCard";
import { cn } from "@/lib/utils";

type SettingsSectionCardProps = {
  title: string;
  icon: string;
  children: ReactNode;
  className?: string;
};

export function SettingsSectionCard({
  title,
  icon,
  children,
  className,
}: SettingsSectionCardProps) {
  return (
    <AppCard className={cn("h-full p-5", className)}>
      <div className="mb-2 flex items-center gap-2">
        <img alt="" className="size-10 object-contain" draggable={false} src={icon} />
        <h2 className="text-base font-black">{title}</h2>
      </div>
      {children}
    </AppCard>
  );
}
