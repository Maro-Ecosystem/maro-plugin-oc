import { AppRepo, Command, PromptPaths, Spinner, Workflow } from "@maro/maro";
import { PromptOcProject, PromptOcServer } from "../../lib";
import { CopyEnv } from "../../steps/envs/CopyEnv";

const CopyEnvCommand: Command = {
  name: "copy",
  aliases: ["cp", "cpy"],
  description: "Copy deployed environment to local repository",
  run: async ({ ctx }) => {
    await new Workflow([
      new PromptPaths({
        paths: ["backend"],
        transform: ({ path }) => ({ app_repo: new AppRepo(path) })
      }),
      new PromptOcServer(),
      new PromptOcProject(),
      new Spinner({
        step: new CopyEnv(),
        message: async ({ app_repo, project }) => {
          const { name } = await app_repo.getInfo();
          return `Copying envs for ${name} from ${project.name}`;
        }
      })
    ]).run(ctx);
  }
};

export default CopyEnvCommand;
