import { ExecutionContext, WorkflowStep } from "@maro/maro";
import { Pod } from "../../lib/oc/pod";

type Reads = { pod: Pod; command: string };
type Writes = {};
type Options = {};

export class PodExec extends WorkflowStep<Reads, Writes, Options> {

  async run(ctx: ExecutionContext, { pod, command }: Reads) {
    const output = await pod.exec(command);
    ctx.logger.info(output);
    return {};
  }
}
