import { ExecutionContext, WorkflowOptions, WorkflowStep } from "@maro/maro";
import { Deployment } from "../../lib/oc/deployment";
import { Pod } from "../../lib/oc/pod";
import { Project } from "../../lib/oc/project";

type Writes = { pods: Pod[] };
type Reads = {
  project?: Project;
  deployment?: Deployment;
};
type Options = {};

export class GetPods extends WorkflowStep<Reads, Writes, Options> {

  constructor(override options?: WorkflowOptions<Options, Writes>) {
    super(options);
  }

  async run(_: ExecutionContext, { project, deployment }: Reads) {
    const source = deployment ?? project;
    if (!source) throw new Error("Could not find source for GetPods");
    const pods = await source.getPods();
    return { pods };
  }
}
