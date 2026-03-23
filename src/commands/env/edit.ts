import { Command, ForEach, Sleep, If, Search, Spinner, ValidateConfig, Workflow } from "@maro/maro";
import { DeploymentRestart, EditResource, GetDeployments, PromptOcConfigMaps, PromptOcSecrets, PromptOcProject, PromptOcServer } from "../../lib";
import { ConfigMap } from "../../lib/oc/configmap";
import { Deployment } from "../../lib/oc/deployment";
import { Secret } from "../../lib/oc/secret";

const EditEnvCommand: Command = {
  name: "edit",
  aliases: ["e"],
  description: "Edit configmap or secret",
  run: async ({ ctx }) => {
    const choices = ["configmap", "secret"] as const;
    await new Workflow([
      new ValidateConfig({ keys: ["paths.namespaces"] }),
      new PromptOcServer(),
      new PromptOcProject(),
      new Search({
        choices,
        message: "Choose type of resource to edit"
      }),
      new If({
        condition: ({ choice }: { choice: typeof choices[number] }) => choice === "configmap",
        then: new PromptOcConfigMaps({ transform: ({ configmap }) => ({ resource: configmap }) }),
        else: new PromptOcSecrets({ transform: ({ secret }) => ({ resource: secret }) })
      }),
      new EditResource(),
      new If({
        condition: async ({ configmap, secret, edited }: { configmap?: ConfigMap; secret?: Secret; edited: boolean }) => {
          const resource = configmap ?? secret;
          if (!resource) throw new Error("No resource found in env edit");
          return edited && await ctx.ui.confirm({
            initial: true,
            message: `Do you want to restart every deployment affected by ${resource.name}?`
          });
        },
        then: new Workflow([
          new Spinner({
            step: new Sleep({ seconds: 10 }),
            message: "Restarting"
          }),
          new GetDeployments(),
          new ForEach({
            concurrency: true,
            item: "deployment",
            step: new DeploymentRestart(),
            items: (state: {
              secret?: Secret;
              configmap?: ConfigMap;
              deployments: Deployment[];
            }) => state.deployments
              .filter(async (d) =>
                d.getSecrets()?.some((s) => s.name === state.secret?.name)
                || (await d.getConfigMaps())?.some((cm) => cm.name === state.configmap?.name)
              )
          })
        ])
      })
    ]).run(ctx);
  }
};

export default EditEnvCommand;
