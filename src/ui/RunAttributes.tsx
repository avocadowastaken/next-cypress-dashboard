import {
  ElectronFramework,
  Firefox,
  GoogleChrome,
  Linux,
  MicrosoftEdge,
  MicrosoftWindows,
  SourceBranch,
} from "@/ui/icons";
import { Avatar, Chip, Grid, Tooltip } from "@material-ui/core";
import { AccessTime, Apple } from "@material-ui/icons";
import { Project, Run } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import React, { ReactElement } from "react";

export function RunOSChip({
  os,
  osVersion,
}: Pick<Run, "os" | "osVersion">): ReactElement {
  return (
    <Tooltip title={`${os} ${osVersion}`}>
      <Chip
        label={osVersion}
        icon={
          os === "darwin" ? (
            <Apple viewBox="0 0 24 26" />
          ) : os === "windows" ? (
            <MicrosoftWindows />
          ) : (
            <Linux />
          )
        }
      />
    </Tooltip>
  );
}

export function RunBrowserChip({
  browser,
  browserVersion,
}: Pick<Run, "browser" | "browserVersion">): ReactElement {
  return (
    <Tooltip title={`${browser} ${browserVersion}`}>
      <Chip
        label={browserVersion}
        icon={
          browser === "chrome" || browser === "chromium" ? (
            <GoogleChrome />
          ) : browser === "edge" ? (
            <MicrosoftEdge />
          ) : browser === "firefox" ? (
            <Firefox />
          ) : (
            <ElectronFramework />
          )
        }
      />
    </Tooltip>
  );
}

export interface RunAttributesProps {
  run: Run;
  project: Project;
}

export function RunAttributes({
  run,
  project,
}: RunAttributesProps): ReactElement {
  return (
    <Grid container={true} spacing={1}>
      <Grid item={true}>
        <Chip
          component="a"
          clickable={true}
          target="_blank"
          rel="noopener noreferrer"
          href={`https://github.com/search?type=users&q=${encodeURIComponent(
            run.commitAuthorName
          )}`}
          label={run.commitAuthorName}
          avatar={
            <Avatar
              alt={run.commitAuthorName}
              src={`/avatar?email=${encodeURIComponent(run.commitAuthorEmail)}`}
            />
          }
        />
      </Grid>

      <Grid item={true}>
        <Tooltip title={run.createdAt.toLocaleString()}>
          <Chip
            icon={<AccessTime />}
            label={
              <>
                Created{" "}
                {formatDistanceToNow(run.createdAt, { addSuffix: true })}
              </>
            }
          />
        </Tooltip>
      </Grid>

      <Grid item={true}>
        <Chip
          component="a"
          target="_blank"
          clickable={true}
          rel="noopener noreferrer"
          icon={<SourceBranch viewBox="0 0 24 26" />}
          label={run.commitBranch || run.commitSha.slice(0, 7)}
          href={`https://github.com/${project.org}/${project.repo}/commit/${run.commitSha}`}
        />
      </Grid>

      <Grid item={true}>
        <RunOSChip os={run.os} osVersion={run.osVersion} />
      </Grid>

      <Grid item={true}>
        <RunBrowserChip
          browser={run.browser}
          browserVersion={run.browserVersion}
        />
      </Grid>
    </Grid>
  );
}
