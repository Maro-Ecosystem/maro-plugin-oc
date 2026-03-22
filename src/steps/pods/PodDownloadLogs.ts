import { ExecutionContext, WorkflowStep, JsonFormatter } from "@maro/maro";
import { Pod } from "../../lib/oc/pod";

type Reads = { pod: Pod };
type Writes = {
  log_file: { name: string; log: string };
};
type Options = {
  raw?: boolean;
};

export class PodDownloadLogs extends WorkflowStep<Reads, Writes, Options> {

  async run(_: ExecutionContext, { pod }: Reads) {
    const formatter = new JsonFormatter();
    const logs = await pod.getLogs();
    const formattedLogs = this.options?.raw
      ? logs
      : formatter.toString(
        logs.split("\n").map((l) =>
          formatter.tryFromString(l)
        ).filter(Boolean)
      );

    const date = new Date().toISOString();
    const file_name = `[${date}]_${pod.name}`;
    return { log_file: { name: file_name, log: formattedLogs } };
  }
}
