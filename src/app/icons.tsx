import { SvgIcon, SvgIconProps } from "@material-ui/core";
import { mdiLockReset } from "@mdi/js";
import { forwardRef, memo, NamedExoticComponent } from "react";

function toSvgIcon(
  name: string,
  d: string
): NamedExoticComponent<SvgIconProps> {
  const Component = memo(
    forwardRef<SVGElement, SvgIconProps>((props) => (
      <SvgIcon {...props}>
        <path d={d} />
      </SvgIcon>
    ))
  );

  Component.displayName = name;

  return Component;
}

export const LockReset = toSvgIcon("LockReset", mdiLockReset);
