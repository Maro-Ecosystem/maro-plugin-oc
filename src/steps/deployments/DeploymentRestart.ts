import { ExecutionContext, WorkflowStep } from "@maro/maro";
import { Deployment } from "../../lib/oc/deployment";

type Writes = {};
type Reads = { deployment: Deployment };
type Options = {};

export class DeploymentRestart extends WorkflowStep<Reads, Writes, Options> {

  async run(_: ExecutionContext, { deployment }: Reads) {
    await deployment.restart();
    return {};
  }
}
