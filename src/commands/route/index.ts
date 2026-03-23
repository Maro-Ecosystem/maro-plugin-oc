import TestRouteCommand from "./test";
import { Command } from "@maro/maro";

const RouteCommands: Command = {
  name: "route",
  description: "Manage OpenShift routes",
  aliases: [],
  subcommands: [
    TestRouteCommand
  ]
};

export default RouteCommands;

