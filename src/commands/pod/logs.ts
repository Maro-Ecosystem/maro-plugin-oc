import { Command, Workflow } from "@maro/maro";
import { GetPods, PodFollowLogs, PromptOcDeployment, PromptOcProject, PromptOcServer } from "../../lib";

const LogsCommand: Command = {
  name: "logs",
  aliases: ["log"],
  description: "Tail pods's logs",
  options: [
    {
      name: "raw",
      type: "boolean",
      description: "Whether to show raw logs, by default logs are formatted as JSON, and every line which is not valid JSON is omitted from logs",
      aliases: ["r"]
    }
  ],
  run: async ({ ctx, args }) => {
    const { raw } = args || {};

    await new Workflow([
      new PromptOcServer(),
      new PromptOcProject(),
      new PromptOcDeployment(),
      new GetPods(),
      new PodFollowLogs({ raw })
    ]).run(ctx);
  }
};

export default LogsCommand;
