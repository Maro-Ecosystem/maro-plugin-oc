import { Command, Effect, If, Search, Workflow } from "@maro/maro";
import { DeleteResource, PromptOcConfigMaps, PromptOcSecrets, PromptOcProject, PromptOcServer } from "../../lib";
import { Resource } from "../../lib/oc/resource";

const DeleteEnvCommand: Command = {
  name: "delete",
  aliases: ["del", "rm"],
  description: "Delete configmap or secret",
  run: async ({ ctx }) => {
    const choices = ["configmap", "secret"] as const;
    await new Workflow([
      new PromptOcServer(),
      new PromptOcProject(),
      new Search({
        choices,
        message: "Choose type of resource to delete"
      }),
      new If({
        condition: ({ choice }: { choice: typeof choices[number] }) => choice === "configmap",
        then: new PromptOcConfigMaps({ transform: ({ configmap }) => ({ resource: configmap }) }),
        else: new PromptOcSecrets({ transform: ({ secret }) => ({ resource: secret }) })
      }),
      new If({
        condition: async (state: { resource: Resource }) =>
          await ctx.ui.confirm({ message: `Are you sure you want to delete ${state.resource.name}?` }),
        then: new DeleteResource(),
        else: new Effect({
          effect: () => ctx.logger.info("Delete canceled")
        })
      })
    ]).run(ctx);
  }
};

export default DeleteEnvCommand;
