import { getInput, setFailed, warning } from "@actions/core";
import { context, getOctokit } from "@actions/github";
import fetch, { Headers } from "node-fetch";

const { CYPRESS_RECORD_KEY } = process.env;
const token = getInput("token", { required: true });
const payload = getInput("payload", { required: true });
const environment = getInput("environment", { required: true });
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
}

async function main(): Promise<void> {
  const deploymentURL = await findDeploymentURL();

  if (!deploymentURL) {
    return warning(
      `There are no deployments for the environment "${environment}"`
    );
  }

  const headers = new Headers({
    Accept: "application/json",
    "Content-Type": "application/json",
  });

  if (CYPRESS_RECORD_KEY) {
    headers.set("Authorization", `Token ${CYPRESS_RECORD_KEY}`);
  }

  const response = await fetch(`${deploymentURL}/api/tasks`, {
    headers,
    body: payload,
    method: "POST",
  });

  if (!response.ok) {
    const responseText = await response.text().catch(() => null);

    throw new Error(
      `Failed to execute task.\n${response.statusText}\n${responseText}`
    );
  }
}

main().catch(setFailed);
