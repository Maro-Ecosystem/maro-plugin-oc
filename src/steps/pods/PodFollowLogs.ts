import { ExecutionContext, WorkflowStep } from "@maro/maro";
import { Pod } from "../../lib/oc/pod";

type Reads = { pods: Pod[] };
type Writes = {};
type Options = {
  raw?: boolean;
};

export class PodFollowLogs extends WorkflowStep<Reads, Writes, Options> {

  async run(_: ExecutionContext, { pods }: Reads) {
    await Promise.all(
      pods.map((p) => p.followLogs({ raw: this.options?.raw }))
    );
    return {};
  }
}
