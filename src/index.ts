import { ConfigRegistry, PluginExport } from "@maro/maro";
import CronCommands from "./commands/cron";
import EnvCommands from "./commands/env";
import PodCommands from "./commands/pod";
import RouteCommands from "./commands/route";
import AppCommands from "./commands/app";
import { OpenShiftConfig } from "./config/openshift";
import { EnvsConfig } from "./config/env";

const plugin: PluginExport = {
  name: "maro-plugin-oc",
  commands: [
    RouteCommands,
    PodCommands,
    EnvCommands,
    CronCommands,
    AppCommands
  ],
  onLoad() {
    ConfigRegistry.register(new OpenShiftConfig())
    ConfigRegistry.register(new EnvsConfig())
  }
};

export default plugin;
