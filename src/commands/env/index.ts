import { Command } from "@maro/maro";
import CopyEnvCommand from "./copy";
import CreateEnvCommand from "./create";
import DeleteEnvCommand from "./delete";
import EditEnvCommand from "./edit";
import GenerateEnvCommand from "./generate";
import HealthEnvCommand from "./health";

const EnvCommands: Command = {
  name: "env",
  description: "Manage environment variables",
  aliases: ["envs"],
  subcommands: [
    CopyEnvCommand,
    CreateEnvCommand,
    DeleteEnvCommand,
    EditEnvCommand,
    GenerateEnvCommand,
    HealthEnvCommand
  ]
};

export default EnvCommands;
