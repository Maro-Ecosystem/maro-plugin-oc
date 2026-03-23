import chalk from "chalk";

import { Command, Table, Config, ForEach, GetAppRepo, Workflow } from "@maro/maro";
import { GetDeployments, PromptDeploymentSources, PromptOcProject, PromptOcServer } from "../../lib";
import { Deployment } from "../../lib/oc/deployment";
import { EnvHealth } from "src/steps/envs/EnvHealth";

const HealthEnvCommand: Command = {
  name: "health",
  aliases: ["h"],
  description: "Detect missing envs in deployment",
  options: [
    {
      name: "all",
      type: "boolean",
      description: "Whether to run the script for all repositories",
      aliases: ["a"]
    }
  ],
  run: async ({ ctx, args }) => {
    const all = args?.all;
    const config = Config.getView();
    await new Workflow([
      new PromptOcServer(),
      new PromptOcProject(),
      new GetDeployments(),
      new PromptDeploymentSources({
        backend: all
      }),
      new ForEach({
        item: "deployment",
        items: (state: { deployments: Deployment[] }) => state.deployments.filter((d) => {
          return !config.get("envs.health_exclusions").includes(d.name);
        }),
        step: new Workflow([
          new GetAppRepo(),
          new Table({
            key: "envs",
            step: new EnvHealth(),
            head: ({ deployment }: { deployment: Deployment }) => [deployment.name, "Status"],
            map: (item) => {
              const color = item.status === "missing" ? chalk.red : chalk.yellow;
              return [item.key, color(item.status)];
            },
            width: [50]
          })
        ])
      })
    ]).run(ctx);
  }
};

export default HealthEnvCommand;
