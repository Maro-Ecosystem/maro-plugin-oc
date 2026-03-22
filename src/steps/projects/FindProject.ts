import { ExecutionContext, WorkflowOptions, WorkflowStep } from "@maro/maro";
import { Project } from "../../lib/oc/project";
import { OpenshiftServer } from "../../lib/oc/server";

type Writes = { project: Project };
type Options = { projectName: string };
type Reads = {
  server: OpenshiftServer;
};

export class FindProject extends WorkflowStep<Reads, Writes, Options> {

  constructor(override options: WorkflowOptions<Options, Writes>) {
    super(options);
  }

  async run(_: ExecutionContext, reads: Reads) {
    const projectName = this.options.projectName;
    const project = await reads.server.getProject(projectName);
    if (!project) throw new Error(`Could not find project ${projectName}`);
    return { project };
  }
}
