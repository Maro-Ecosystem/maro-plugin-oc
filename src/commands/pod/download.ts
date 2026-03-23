import { Command, CreateLogFile, ForEach, Workflow } from "@maro/maro";
import { GetPods, Pod, PodDownloadLogs, PromptOcPod, PromptOcProject, PromptOcServer } from "../../lib";

const DownloadLogsCommand: Command = {
  name: "download-logs",
  aliases: ["dwnld", "download"],
  description: "Download pod logs",
  options: [
    {
      name: "raw",
      type: "boolean",
      description: "Whether to download raw logs, by default logs are formatted as JSON, and every line which is not valid JSON is omitted from logs",
      aliases: ["r"]
    }
  ],
  run: async ({ ctx, args }) => {
    const { raw } = args || {};
    await new Workflow([
      new PromptOcServer(),
      new PromptOcProject(),
      new GetPods(),
      new PromptOcPod(),
      new ForEach({
        items: (state: { pods: Pod[]; pod: Pod }) => state.pods.filter((p) => p.container === state.pod.container),
        item: "pod",
        step: new Workflow([
          new PodDownloadLogs({ raw }),
          new CreateLogFile()
        ])
      })
    ]).run(ctx);
  }
};

export default DownloadLogsCommand;
