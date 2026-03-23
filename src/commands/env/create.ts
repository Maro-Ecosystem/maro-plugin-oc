import {
  Command,
  Effect,
  EnvFormatter,
  Exit,
  If,
  Input,
  PromptTempFile,
  Search,
  ValidateConfig,
  Workflow,
} from "@maro/maro";
import { CreateConfigMap, CreateSecret, PromptOcProject, PromptOcServer } from "../../lib";

type Resource = "configmap" | "secret";

const CreateEnvCommand: Command = {
  name: "create",
  aliases: [],
  description: "Create configmap or secret",
  run: async ({ ctx }) => {
    const choices = ["configmap", "secret"] as const;
    await new Workflow([
      new ValidateConfig({ keys: ["paths.namespaces"] }),
      new PromptOcServer(),
      new PromptOcProject(),
      new Search({
        choices,
        message: "Choose type of resource to create"
      }),
      new Input({
        message: (state: { choice: Resource }) => `Enter a name for the new ${state.choice}`,
        write: "name"
      }),
      new PromptTempFile({
        content: "KEY=VAL",
        formatter: new EnvFormatter(),
        transform: ({ changed, file }) => ({ changed, data: file })
      }),
      new If({
        condition: ({ changed }: { changed: boolean }) => !changed,
        then: new Workflow([
          new Effect({ effect: () => ctx.logger.info("Create canceled, no changes made") }),
          new Exit({ error: false })
        ])
      }),
      new If({
        condition: ({ choice }: { choice: typeof choices[number] }) => choice === "configmap",
        then: new CreateConfigMap(),
        else: new CreateSecret()
      })
    ]).run(ctx);
  }
};

export default CreateEnvCommand;
