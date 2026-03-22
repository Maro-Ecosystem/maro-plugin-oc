import { ExecutionContext, WorkflowStep } from "@maro/maro";
import { Pod } from "../../lib/oc/pod";

type Reads = { pod: Pod };
type Writes = {};
type Options = {};

export class PodRemoteSession extends WorkflowStep<Reads, Writes, Options> {

  async run(_: ExecutionContext, { pod }: Reads) {
    pod.remoteSession();
    return {};
  }
}
