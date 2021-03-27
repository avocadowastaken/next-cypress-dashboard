import { getInput, info, setFailed, warning } from "@actions/core";
import { context, getOctokit } from "@actions/github";
import fetch from "node-fetch";

const token = getInput("token", { required: true });
const name = getInput("name", { required: true });
const environment = getInput("environment", { required: true });
const ignoreErrors = getInput("ignore_errors", { required: false }) === "true";

const octokit = getOctokit(token);

async function findDeploymentURL(): Promise<string | undefined> {
  for await (const { data: deployments } of octokit.paginate.iterator(
    "GET /repos/{owner}/{repo}/deployments",
    {
      ...context.repo,
      environment,
      per_page: 10,
      task: "deploy",
    }
  )) {
    for (const { id } of deployments) {
      const {
        data: statuses,
      } = await octokit.request(
        "GET /repos/{owner}/{repo}/deployments/{deployment_id}/statuses",
        { ...context.repo, deployment_id: id }
      );

      for (const { state, target_url } of statuses) {
        if (state === "success" && target_url) {
          return target_url;
        }
      }
    }
  }

  return undefined;
}

async function main(): Promise<void> {
  const deploymentURL = await findDeploymentURL();

  if (!deploymentURL) {
    return warning(
      `There are no deployments for the environment '${environment}'`
    );
  }

  info(`Making request to: '${deploymentURL}' with '${name}'…`);

  const response = await fetch(`${deploymentURL}/api/tasks/${name}`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Token ${process.env.TASKS_API_SECRET}`,
    },
  });

  const responseText = await response.text().catch(() => null);
  if (!response.ok) {
    throw new Error(
      `Failed to execute task.\n${response.statusText}\n${responseText}`
    );
  } else if (responseText) {
    info(responseText);
  }
}

main().catch((error) => {
  if (ignoreErrors) {
    warning(error);
  } else {
    setFailed(error);
  }
});
