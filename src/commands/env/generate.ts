import { Command, Config, ForEach, Workflow, filterFrontendDeployments } from "@maro/maro";
import { GenerateConfigMap, GetDeployments, PromptDeploymentSources, PromptOcProject, PromptOcServer } from "../../lib";
import { Deployment } from "../../lib/oc/deployment";

const GenerateEnvCommand: Command = {
  name: "generate",
  aliases: ["gen"],
  description: "Generate self containing configmaps",
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
    const prefix = config.get("envs.generate.prefix") ?? "";
    const excluded = config.get("envs.generate.exclusions") ?? [];
    const excluded_prefix: string[] = config.get("envs.generate.prefix_exclusions") ?? [];

    await new Workflow([
      new PromptOcServer(),
      new PromptOcProject(),
      new GetDeployments({
        transform: ({
          deployments
        }) => ({
          deployments:
            deployments
              .filter((d) => !filterFrontendDeployments(d))
              .filter((d) => !excluded.includes(d.name))
              .filter((d) => !excluded_prefix.some((p) => d.name.split(prefix)[1]?.startsWith(p)))
        })
      }),
      new PromptDeploymentSources({
        frontend: false,
        backend: all
      }),
      new ForEach({
        concurrency: true,
        item: "deployment",
        items: (state: { deployments: Deployment[] }) => state.deployments,
        step: new GenerateConfigMap()
      })

    ]).run(ctx);
  }
};

export default GenerateEnvCommand;
