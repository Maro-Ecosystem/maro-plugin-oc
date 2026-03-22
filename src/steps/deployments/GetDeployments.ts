import { ExecutionContext, WorkflowStep, WorkflowOptions } from "@maro/maro";
import { Deployment } from "../../lib/oc/deployment";
import { Project } from "../../lib/oc/project";


type Writes = { deployments: Deployment[] };
type Reads = { project: Project };
type Options = {};

export class GetDeployments extends WorkflowStep<Reads, Writes, Options> {

  constructor(override options?: WorkflowOptions<Options, Writes>) {
    super(options);
  }

  async run(_: ExecutionContext, { project }: Reads) {
    const deployments = await project.getDeployments();
    return { deployments };
  }
}
