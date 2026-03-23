import { Command, Workflow } from "@maro/maro";
import { PodRemoteSession, PromptOcPod, PromptOcProject, PromptOcServer } from "../../lib";

const RemoteSessionCommand: Command = {
  name: "remote-session",
  aliases: ["rsh", "remote"],
  description: "Start a remote session",
  run: async ({ ctx }) => {
    await new Workflow([
      new PromptOcServer(),
      new PromptOcProject(),
      // TODO(20260318-002450): maybe prompt for deployment and open one
      // remote session in each pod if we ever integrate with a multiplexer ?
      new PromptOcPod(),
      new PodRemoteSession()
    ]).run(ctx);
  }
};

export default RemoteSessionCommand;
