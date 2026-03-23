import { Command } from "@maro/maro";

import LogCommand from "./log";

const CronCommands: Command = {
  name: "cron",
  description: "Manage CronJobs",
  aliases: ["crn"],
  subcommands: [
    LogCommand
  ]
};

export default CronCommands;

