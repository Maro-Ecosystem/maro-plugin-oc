import { ConfigRegistry, PluginExport } from "@maro/maro";
import CronCommands from "./commands/cron";
import EnvCommands from "./commands/env";
import PodCommands from "./commands/pod";
import RouteCommands from "./commands/route";
import { OpenShiftConfig } from "./config";

const plugin: PluginExport = {
  name: "maro-plugin-oc",
  commands: [
    RouteCommands,
    PodCommands,
    EnvCommands,
    CronCommands
  ],
  onLoad() {
    ConfigRegistry.register(new OpenShiftConfig())
  }
};

export default plugin;
