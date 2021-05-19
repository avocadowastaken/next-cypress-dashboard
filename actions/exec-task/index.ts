import { getInput, group, info, setFailed, warning } from "@actions/core";
import { context, getOctokit } from "@actions/github";
import fetch from "node-fetch";

const token = getInput("token", { required: true });
const name = getInput("name", { required: true });
const environment = getInput("environment", { required: true });
const ignoreErrors = getInput("ignore_errors", { required: false }) === "true";

const octokit = getOctokit(token);

async function findDeploymentURL(): Promise<string | undefined> {
  info("Fetching latest deployments");

  for await (const { data: deployments } of octokit.paginate.iterator(
    "GET /repos/{owner}/{repo}/deployments",
    {
      ...context.repo,
      environment,
      per_page: 10,
      task: "deploy",
    }
  )) {
    info(
      deployments.length === 0
        ? "No deployment found"
        : deployments.length === 1
        ? "One deployment found"
        : `${deployments.length} deployments found`
    );

    for (const { id } of deployments) {
      info(`Fetching deployment status of the: ${id}`);

      const { data: statuses } = await octokit.request(
        "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses",
        { ...context.repo, deployment_id: id }
      );

      info(
        statuses.length === 0
          ? "No deployment status found"
          : statuses.length === 1
          ? "One deployment status found"
          : `${statuses.length} deployment statuses found`
      );

      for (const { state, target_url } of statuses) {
        if (state === "success" && target_url) {
          info(`Success deployment found: ${target_url}`);

          return target_url;
        }
      }
    }
  }

  return undefined;
}

async function main(): Promise<void> {
  const deploymentURL = await group(
    `Getting deployment for the environment: ${environment}`,
    findDeploymentURL
  );

  if (!deploymentURL) {
    return warning(
      `There are no deployments for the environment '${environment}'`
    );
  }

  await group(`Execute task: ${name}`, async () => {
    info(`Requesting: '${deploymentURL}'`);

    const response = await fetch(`${deploymentURL}/api/tasks/${name}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Token ${process.env.NCD_SECRET}`,
      },
    });

    info(`Parsing response: ${response.status} (${response.statusText})`);

    const responseText = await response.text().catch(() => null);

    info(`Parsed response:\n${responseText}`);

    if (!response.ok) {
      throw new Error(
        `Failed to execute task.\n${response.statusText}\n${responseText}`
      );
    }
  });
}

main().catch((error) => {
  if (ignoreErrors) {
    warning(error);
  } else {
    setFailed(error);
  }
});
