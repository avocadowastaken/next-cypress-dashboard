import {
  ElectronFramework,
  Firefox,
  GoogleChrome,
  Linux,
  MicrosoftEdge,
  MicrosoftWindows,
  SourceBranch,
} from "@/app/icons";
import { CreateRunInput } from "@/shared/cypress-types";
import { Avatar, Chip, Grid, Tooltip } from "@material-ui/core";
import { AccessTime, Apple } from "@material-ui/icons";
import { Project, Run } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import React, { ReactElement } from "react";

export interface RunAttributesProps {
  run: Run;
  project: Project;
}

export function RunAttributes({
  run,
  project,
}: RunAttributesProps): ReactElement {
  const commit = run.commit as CreateRunInput["commit"];
  const platform = run.platform as CreateRunInput["platform"];

  return (
    <Grid container={true} spacing={1}>
      <Grid item={true}>
        <Chip
          component="a"
          clickable={true}
          target="_blank"
          rel="noopener noreferrer"
          href={`https://github.com/search?type=users&q=${encodeURIComponent(
            commit.authorName
          )}`}
          label={commit.authorName}
          avatar={
            <Avatar
              alt={commit.authorName}
              src={`/avatar?email=${encodeURIComponent(commit.authorEmail)}`}
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
                {formatDistanceToNow(run.createdAt, {
                  addSuffix: true,
                })}
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
          label={commit.branch}
          icon={<SourceBranch />}
          rel="noopener noreferrer"
          href={`https://github.com/${project.org}/${project.repo}/commit/${commit.sha}`}
        />
      </Grid>

      <Grid item={true}>
        <Tooltip title={`${platform.osName} ${platform.osVersion}`}>
          <Chip
            label={platform.osVersion}
            icon={
              platform.osName === "darwin" ? (
                <Apple viewBox="0 0 24 26" />
              ) : platform.osName === "windows" ? (
                <MicrosoftWindows />
              ) : (
                <Linux />
              )
            }
          />
        </Tooltip>
      </Grid>

      <Grid item={true}>
        <Tooltip title={`${platform.browserName} ${platform.browserVersion}`}>
          <Chip
            label={platform.browserVersion}
            icon={
              platform.browserName === "Chrome" ||
              platform.browserName === "Chromium" ? (
                <GoogleChrome />
              ) : platform.browserName === "Edge" ? (
                <MicrosoftEdge />
              ) : platform.browserName === "Firefox" ? (
                <Firefox />
              ) : (
                <ElectronFramework />
              )
            }
          />
        </Tooltip>
      </Grid>
    </Grid>
  );
}
