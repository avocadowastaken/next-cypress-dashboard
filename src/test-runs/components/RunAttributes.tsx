import { DateChip } from "@/core/components/DateChip";
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
import { LinkChip } from "@/core/components/LinkChip";
import { Inline } from "@/core/layout/Inline";
import { Stack } from "@/core/layout/Stack";
import { capitalize } from "@/lib/Text";
import { getRunName } from "@/test-runs/helpers";
import { Avatar, Chip, Link, Tooltip } from "@material-ui/core";
import { Apple, Check, Error, LocalOfferOutlined } from "@material-ui/icons";
import { Project, Run } from "@prisma/client";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";

const TAG_PATTERN = /^refs\/tags\/(.+)$/;
const PR_BRANCH_PATTERN = /^refs\/pull\/(\d+)\/merge$/;

export interface RunAttributesProps {
  run: Run;
  project: Project;
}

function RunBranchChip({ run, project }: RunAttributesProps): ReactElement {
  const repoUrl = `https://github.com/${project.org}/${project.repo}`;
  if (run.commitBranch) {
    const tagMatches = run.commitBranch.match(TAG_PATTERN);

    if (tagMatches) {
      const [, tag] = tagMatches;
      return (
        <LinkChip
          label={tag}
          icon={<LocalOfferOutlined />}
          href={`${repoUrl}/releases/tag/${tag}`}
        />
      );
    }

    const prBranchMatches = run.commitBranch.match(PR_BRANCH_PATTERN);
    if (prBranchMatches) {
      const [, pr] = prBranchMatches;
      return (
        <LinkChip
          label={pr}
          icon={<SourcePull />}
          href={`${repoUrl}/pull/${pr}/commits/${run.commitSha}}`}
        />
      );
    }

    return (
      <LinkChip
        label={run.commitBranch}
        icon={<SourceBranch viewBox="0 0 24 26" />}
        href={`${repoUrl}/commit/${run.commitSha}`}
      />
    );
  }

  return (
    <LinkChip
      icon={<SourceCommit />}
      label={run.commitSha.slice(0, 7)}
      href={`${repoUrl}/commit/${run.commitSha}`}
    />
  );
}

export function RunAttributes({
  run,
  project,
}: RunAttributesProps): ReactElement {
  const router = useRouter();

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

        <DateChip value={run.createdAt} />

        <LinkChip
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

        <RunBranchChip run={run} project={project} />

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
