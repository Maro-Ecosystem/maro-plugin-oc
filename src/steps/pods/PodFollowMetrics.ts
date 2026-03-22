import { ExecutionContext, WorkflowStep } from "@maro/maro";
import { Pod } from "../../lib/oc/pod";

type Reads = { pods: Pod[] };
type Writes = {};
type Options = {};

export class PodFollowMetrics extends WorkflowStep<Reads, Writes, Options> {

  async run(_: ExecutionContext, { pods }: Reads) {
    await Promise.all(
      pods.map((p) => p.followMetrics())
    );
    return {};
  }
}
