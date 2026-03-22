import { ExecutionContext, WorkflowOptions, WorkflowStep } from "@maro/maro";
import { ConfigMap } from "../../lib/oc/configmap";
import { Project } from "../../lib/oc/project";

type Writes = { configmaps: ConfigMap[] };
type Reads = { project: Project };
type Options = {};

export class GetConfigMaps extends WorkflowStep<Reads, Writes, Options> {

  constructor(override options?: WorkflowOptions<Options, Writes>) {
    super(options);
  }

  async run(_: ExecutionContext, { project }: Reads) {
    const configmaps = await project.getConfigMaps();
    return { configmaps };
  }
}
