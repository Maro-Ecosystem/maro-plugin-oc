import { ExecutionContext, WorkflowOptions, WorkflowStep } from "@maro/maro";
import { ConfigMap } from "../../lib/oc/configmap";
import { Project } from "../../lib/oc/project";

type Writes = { configmap: ConfigMap };
type Reads = { project: Project };
type Options<Reads> = {
  filter?: (configmap: ConfigMap, reads: Reads) => boolean;
};

export class PromptOcConfigMaps<R extends Reads = Reads> extends WorkflowStep<R, Writes, Options<R>> {

  constructor(override options?: WorkflowOptions<Options<Reads>, Writes>) {
    super(options);
  }

  async run(ctx: ExecutionContext, reads: Reads) {
    const deployments = await reads.project.getConfigMaps();
    const filtered = this.options?.filter
      ? deployments.filter((d) => this.options?.filter!(d, reads))
      : deployments;

    const configmap = await ctx.ui.promptChoice(filtered, { message: "Select configmap" });
    return { configmap };
  }
}
