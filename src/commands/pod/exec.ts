import { Command, Input, Workflow } from "@maro/maro";
import { PodExec, PromptOcPod, PromptOcProject, PromptOcServer } from "../../lib";

const ExecCommand: Command = {
  name: "exec",
  description: "Run a command inside a pod",
  run: async ({ ctx }) => {
    await new Workflow([
      new PromptOcServer(),
      new PromptOcProject(),
      new PromptOcPod(),
      new Input({ message: "Input command to exec", write: "command" }),
      new PodExec()
    ]).run(ctx);
  }
};

export default ExecCommand;
