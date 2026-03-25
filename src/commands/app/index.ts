import { Command, } from "@maro/maro"
import StatusCommand from "./status";
import StartCommand from "./start";

const AppCommands: Command = {
  name: "app",
  subcommands: [
    StartCommand,
    StatusCommand
  ]
};

export default AppCommands;



