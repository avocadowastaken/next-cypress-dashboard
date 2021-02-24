import { SvgIcon, SvgIconProps } from "@material-ui/core";
import {
  mdiDebugStepOver,
  mdiElectronFramework,
  mdiFirefox,
  mdiGoogleChrome,
  mdiLinux,
  mdiMicrosoftEdge,
  mdiMicrosoftWindows,
  mdiSourceBranch,
  mdiSourceCommit,
  mdiSourcePull,
  mdiSyncCircle,
} from "@mdi/js";
import { forwardRef, memo, NamedExoticComponent } from "react";

function toSvgIcon(
  name: string,
  d: string
): NamedExoticComponent<SvgIconProps> {
  const Component = memo(
    forwardRef<SVGSVGElement, SvgIconProps>((props, ref) => (
      <SvgIcon ref={ref} {...props}>
        <path d={d} fill="currentColor" />
      </SvgIcon>
    ))
  );

  Component.displayName = name;

  return Component;
}

export const Linux = toSvgIcon("Linux", mdiLinux);
export const SyncCircle = toSvgIcon("SyncCircle", mdiSyncCircle);
export const DebugStepOver = toSvgIcon("DebugStepOver", mdiDebugStepOver);
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
export const SourcePull = toSvgIcon("SourcePull", mdiSourcePull);
export const SourceBranch = toSvgIcon("SourceBranch", mdiSourceBranch);
export const SourceCommit = toSvgIcon("SourceCommit", mdiSourceCommit);
