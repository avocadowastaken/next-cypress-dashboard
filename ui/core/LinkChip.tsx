import { Chip } from "@mui/material";
import { ReactElement, ReactNode } from "react";

export interface LinkChipProps {
  href: string;
  label?: ReactNode;
  icon?: ReactElement;
  avatar?: ReactElement;
}

export function LinkChip({
  href,
  avatar,
  label,
  icon,
}: LinkChipProps): ReactElement {
  return (
    <Chip
      component="a"
      clickable={true}
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      icon={icon}
      label={label}
      avatar={avatar}
    />
  );
}
