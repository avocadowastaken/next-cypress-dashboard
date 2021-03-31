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
import { Inline } from "@/core/layout/Inline";
import { Stack } from "@/core/layout/Stack";
import { capitalize } from "@/lib/Text";
import { getRunName } from "@/test-runs/helpers";
import { Avatar, Chip, Link, Tooltip } from "@material-ui/core";
import { AccessTime, Apple, Check, Error } from "@material-ui/icons";
import { Project, Run } from "@prisma/client";
import { formatDistanceToNowStrict } from "date-fns";
import NextLink from "next/link";
import { useRouter } from "next/router";
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
  const router = useRouter();
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
    <Stack>
      <NextLink
        passHref={true}
        href={{
          query: { exclude: router.query.exclude || [] },
          pathname: `/projects/${project.id}/runs/${run.id}`,
        }}
      >
        <Link variant="subtitle1">{getRunName(run)}</Link>
      </NextLink>

      <Inline>
        {run.totalFailed > 0 ? (
          <Chip icon={<Error />} label="Failed" />
        ) : run.totalPassed > 0 ? (
          <Chip icon={<Check />} label="Passed" />
        ) : null}

        <DurationChip start={run.createdAt} finish={run.completedAt} />

        <Tooltip title={run.createdAt.toLocaleString()}>
          <Chip
            icon={<AccessTime />}
            label={formatDistanceToNowStrict(run.createdAt, {
              addSuffix: true,
            })}
          />
        </Tooltip>

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
              src={`/api/avatar/${encodeURIComponent(run.commitAuthorEmail)}`}
            />
          }
        />

        <Chip
          component="a"
          target="_blank"
          clickable={true}
          href={branchHref}
          icon={branchIcon}
          label={branchLabel}
          rel="noopener noreferrer"
        />

        <Tooltip title={`${capitalize(run.os)} ${run.osVersion}`}>
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

        <Tooltip title={`${capitalize(run.browser)} ${run.browserVersion}`}>
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
      </Inline>
    </Stack>
  );
}
