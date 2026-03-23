import DownloadLogsCommand from "./download";
import LogsCommand from "./logs";
import MetricsCommand from "./metrics";
import RemoteSessionCommand from "./remote_session";
import RestartCommand from "./restart";
import ExecCommand from "./exec";
import { Command } from "@maro/maro";

const PodCommands: Command = {
  name: "pod",
  description: "Manage OpenShift pods",
  aliases: ["pods"],
  subcommands: [
    DownloadLogsCommand,
    LogsCommand,
    MetricsCommand,
    RemoteSessionCommand,
    RestartCommand,
    ExecCommand,
  ]
};

export default PodCommands;

