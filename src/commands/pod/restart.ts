import { Command, ForEach, If, Workflow } from "@maro/maro";
import {
  Deployment,
  Secret,
  DeploymentRestart,
  GetDeployments,
  PromptDeploymentSources,
  PromptOcProject,
  PromptOcSecrets,
  PromptOcServer,
} from "../../lib";

const RestartCommand: Command = {
  name: "restart",
  aliases: [],
  description: "Restart rollout for pod",
  options: [
    {
      name: "secret",
      type: "boolean",
      description: "Restart all deployments affected by a secret",
      aliases: ["s"]
    },
    {
      name: "all",
      type: "boolean",
      description: "Whether to run the script for all repositories",
      aliases: ["a"]
    },
    {
      name: "frontend",
      type: "boolean",
      description: "Whether to run the script for all frontend repositories",
      aliases: ["f"]
    },
    {
      name: "backend",
      type: "boolean",
      description: "Whether to run the script for all backend repositories",
      aliases: ["b"]
    }
  ],
  run: async ({ ctx, args }) => {
    const { secret, all, frontend, backend } = args || {};
    await new Workflow([
      new PromptOcServer(),
      new PromptOcProject(),
      new GetDeployments(),
      new If({
        condition: () => Boolean(secret),
        then: new PromptOcSecrets(),
        else: new PromptDeploymentSources({
          backend: all || backend,
          frontend: all || frontend
        })
      }),
      new ForEach({
        item: "deployment",
        items: ({ deployments, secret }: { deployments: Deployment[]; secret?: Secret }) =>
          deployments.filter(
            (d) => secret ? d.getSecrets()?.some((s) => s.name === secret.name) : true
          ),
        step: new DeploymentRestart(),
        concurrency: true
      })
    ]).run(ctx);
  }
};

export default RestartCommand;
