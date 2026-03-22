import { ConfigRegistry, PluginExport } from "../../../dist/lib";
import { OpenShiftConfig } from "./config";

const plugin: PluginExport = {
  name: "maro-plugin-oc",
  commands: [],
  onLoad() {
    ConfigRegistry.register(new OpenShiftConfig())
  }
};

export default plugin;
