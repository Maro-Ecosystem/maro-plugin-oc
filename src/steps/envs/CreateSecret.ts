import { ExecutionContext, WorkflowStep } from "@maro/maro";
import { Project } from "../../lib/oc/project";

type Reads = {
  project: Project;
  name: string;
  data: Record<string, string>;
};
type Writes = {};
type Options = {};

export class CreateSecret extends WorkflowStep<Reads, Writes, Options> {

  async run(ctx: ExecutionContext, { project, name, data }: Reads) {
    const log = ctx.logger;
    const cm = await project.createSecret(name, data);
    log.success(`${cm.name} created`);
    return {};
  }
}
