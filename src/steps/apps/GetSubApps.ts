import { AppRepo, ExecutionContext, getPaths, loading, WorkflowOptions, WorkflowStep } from "@maro/maro";
import { OpenshiftServer, Project } from "../../lib";
import { CopyEnv } from "../envs/CopyEnv";
import { OcEnvFile } from "../../lib/files/env_file";

type Reads = {
  app_repo: AppRepo;
  server: OpenshiftServer;
  project: Project;
  sub_apps?: AppRepo[];
};
type Writes = { sub_apps: AppRepo[] };
type Options = {
  include_initial?: boolean;
  reuse?: boolean;
  depth?: number;
};

export class GetSubApps extends WorkflowStep<Reads, Writes> {

  constructor(override options?: WorkflowOptions<Options, Writes>) {
    super(options);
  }

  @loading("Getting sub apps")
  async run(ctx: ExecutionContext, { app_repo, server, project, ...state }: Reads) {
    const backend = getPaths("backend");
    const apps = backend.map((b) => new AppRepo(b));
    const sub_apps: AppRepo[] = this.options?.reuse ? state.sub_apps ?? [] : [];
    const depth = this.options?.depth;

    if (this.options?.include_initial) sub_apps.push(app_repo);

    async function getSubApps(repo: AppRepo, currentDepth: number): Promise<void> {
      if (depth !== undefined && currentDepth >= depth) return;

      const { name: app } = await repo.getInfo();
      const env = new OcEnvFile(repo.env.path, server);

      await new CopyEnv().run(ctx, { app_repo: repo, project, server });
      env.internal();

      const { name } = await app_repo.getInfo();
      const deployment = await project.getDeployment(name);
      const version = deployment.version;

      if (!version) throw new Error(`Version not found for ${app} in project ${project.name}`);

      await repo.checkout(version);

      const envEntries = Object.entries(env.read());

      for (const [_, value] of envEntries) {
        if (typeof value !== "string") continue;

        const host = URL.canParse(value) ? new URL(value).hostname : null;
        if (!host) continue;

        const sub_app_name = host.split(".")[0];

        const found = await Promise.all(
          apps.map(async (a) => {
            const { name } = await a.getInfo();
            return sub_app_name === name;
          })
        );

        const foundIndex = found.findIndex(Boolean);
        if (foundIndex === -1) continue;

        const sub_app = apps[foundIndex]!;
        const already_added = sub_apps.some((r) => r.dir.path === sub_app.dir.path);
        if (already_added) continue;

        const sub_app_repo = new AppRepo(sub_app.dir);

        sub_apps.push(sub_app_repo);

        await getSubApps(sub_app_repo, currentDepth + 1);
      }
    }

    await getSubApps(app_repo, 0);
    return { sub_apps };
  }
}

