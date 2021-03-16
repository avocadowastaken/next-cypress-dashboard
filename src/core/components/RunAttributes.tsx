import { DurationChip } from "@/core/components/DurationChip";
import {
  ElectronFramework,
  Firefox,
  GoogleChrome,
  Linux,
  MicrosoftEdge,
  MicrosoftWindows,
  SourceBranch,
  SourceCommit,
  SourcePull,
} from "@/core/components/icons";
import { Avatar, Chip, Grid, Link, Tooltip } from "@material-ui/core";
import { AccessTime, Apple, Check, Error } from "@material-ui/icons";
import { Project, Run } from "@prisma/client";
import { formatDistanceToNowStrict } from "date-fns";
import NextLink from "next/link";
import React, { ReactElement, useMemo } from "react";

const PR_BRANCH_PATTERN = /^refs\/pull\/(\d+)\/merge$/;

export interface RunAttributesProps {
  run: Run;
  project: Project;
}

export function RunAttributes({
  run,
  project,
}: RunAttributesProps): ReactElement {
  const [branchIcon, branchLabel, branchHref] = useMemo<
    [icon: ReactElement, label: string, url: string]
  >(() => {
    const repoUrl = `https://github.com/${project.org}/${project.repo}`;

    if (run.commitBranch) {
      const prBranchMatches = run.commitBranch.match(PR_BRANCH_PATTERN);

      if (prBranchMatches) {
        const [, pr] = prBranchMatches;

        return [
          <SourcePull />,
          pr,
          `${repoUrl}/pull/${pr}/commits/${run.commitSha}`,
        ];
      }

      return [
        <SourceBranch viewBox="0 0 24 26" />,
        run.commitBranch,
        `${repoUrl}/commit/${run.commitSha}`,
      ];
    }

    return [
      <SourceCommit />,
      run.commitSha.slice(0, 7),
      `${repoUrl}/commit/${run.commitSha}`,
    ];
  }, [project.org, project.repo, run.commitSha, run.commitBranch]);

  return (
    <Grid container={true} spacing={1}>
      <Grid item={true} xs={12}>
        <NextLink
          passHref={true}
          href={`/projects/${project.id}/runs/${run.id}`}
        >
          <Link variant="subtitle1">{run.commitMessage || run.ciBuildId}</Link>
        </NextLink>
      </Grid>

      {run.totalFailed > 0 ? (
        <Grid item={true}>
          <Chip icon={<Error />} label="Failed" />
        </Grid>
      ) : run.totalPassed > 0 ? (
        <Grid item={true}>
          <Chip icon={<Check />} label="Passed" />
        </Grid>
      ) : null}

      <Grid item={true}>
        <DurationChip start={run.createdAt} finish={run.completedAt} />
      </Grid>

      <Grid item={true}>
        <Tooltip title={run.createdAt.toLocaleString()}>
          <Chip
            icon={<AccessTime />}
            label={formatDistanceToNowStrict(run.createdAt, {
              addSuffix: true,
            })}
          />
        </Tooltip>
      </Grid>

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
        <Chip
          component="a"
          target="_blank"
          clickable={true}
          href={branchHref}
          icon={branchIcon}
          label={branchLabel}
          rel="noopener noreferrer"
        />
      </Grid>

      <Grid item={true}>
        <Tooltip title={`${run.os} ${run.osVersion}`}>
          <Chip
            label={run.osVersion}
            icon={
              run.os === "darwin" ? (
                <Apple viewBox="0 0 24 26" />
              ) : run.os === "windows" ? (
                <MicrosoftWindows />
              ) : (
                <Linux />
              )
            }
          />
        </Tooltip>
      </Grid>

      <Grid item={true}>
        <Tooltip title={`${run.browser} ${run.browserVersion}`}>
          <Chip
            label={run.browserVersion}
            icon={
              run.browser === "chrome" || run.browser === "chromium" ? (
                <GoogleChrome />
              ) : run.browser === "edge" ? (
                <MicrosoftEdge />
              ) : run.browser === "firefox" ? (
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
