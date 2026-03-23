import { Command, Workflow } from "@maro/maro";
import { GetPods, PodFollowMetrics, PromptOcDeployment, PromptOcProject, PromptOcServer } from "../../lib";

const MetricsCommand: Command = {
  name: "metrics",
  aliases: ["metric"],
  description: "Observe pod metrics in real time",
  run: async ({ ctx }) => {
    await new Workflow([
      new PromptOcServer(),
      new PromptOcProject(),
      new PromptOcDeployment(),
      new GetPods(),
      new PodFollowMetrics()
    ]).run(ctx);
  }
};

export default MetricsCommand;
