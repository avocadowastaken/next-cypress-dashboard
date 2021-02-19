import { SvgIcon, SvgIconProps } from "@material-ui/core";
import {
  mdiElectronFramework,
  mdiFirefox,
  mdiGoogleChrome,
  mdiLinux,
  mdiMicrosoftEdge,
  mdiMicrosoftWindows,
  mdiSourceBranch,
} from "@mdi/js";
import { forwardRef, memo, NamedExoticComponent } from "react";

function toSvgIcon(
  name: string,
  d: string
): NamedExoticComponent<SvgIconProps> {
  const Component = memo(
    forwardRef<SVGElement, SvgIconProps>((props) => (
      <SvgIcon {...props}>
        <path d={d} fill="currentColor" />
      </SvgIcon>
    ))
  );

  Component.displayName = name;

  return Component;
}

export const Linux = toSvgIcon("Linux", mdiLinux);
export const MicrosoftEdge = toSvgIcon("MicrosoftEdge", mdiMicrosoftEdge);
export const MicrosoftWindows = toSvgIcon(
  "MicrosoftWindows",
  mdiMicrosoftWindows
);
export const ElectronFramework = toSvgIcon(
  "ElectronFramework",
  mdiElectronFramework
);
export const GoogleChrome = toSvgIcon("GoogleChrome", mdiGoogleChrome);
export const Firefox = toSvgIcon("Firefox", mdiFirefox);
export const SourceBranch = toSvgIcon("SourceBranch", mdiSourceBranch);
