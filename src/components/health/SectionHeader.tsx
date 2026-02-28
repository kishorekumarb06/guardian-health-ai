import { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  action?: ReactNode;
}

export const SectionHeader = ({ title, action }: SectionHeaderProps) => (
  <div className="mb-3 flex items-center justify-between">
    <h2 className="text-sm font-bold text-foreground">{title}</h2>
    {action}
  </div>
);
