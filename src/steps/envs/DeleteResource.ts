import { ExecutionContext, WorkflowStep } from "@maro/maro";
import { Resource } from "../../lib/oc/resource";

type Reads = { resource: Resource };
type Writes = {};
type Options = {};

export class DeleteResource extends WorkflowStep<Reads, Writes, Options> {

  async run(ctx: ExecutionContext, { resource }: Reads) {
    const log = ctx.logger;
    await resource.delete();
    log.success(`Deleted ${resource.name} correctly`);
    return {};
  }
}
