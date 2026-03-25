import { AppRepo, Config, ExecutionContext, WorkflowStep } from "@maro/maro";
import { Deployment } from "../../lib";

type Reads = {
  deployment: Deployment;
  app_repo: AppRepo;
};

type Writes = {
  envs: { key: string; status: typeof status[keyof typeof status] }[];
};

const status = {
  UNUSED: "unused",
  MISSING: "missing"
} as const;

export class EnvHealth extends WorkflowStep<Reads, Writes> {
  async run(ctx: ExecutionContext, reads: Reads) {
    const { deployment, app_repo } = reads;
    const version = deployment.version;
    const log = ctx.logger;
    const config = Config.getView();

    if (!version) {
      log.warning(`Could not find version for ${deployment.name}`);
      return { envs: [] };
    }
    const active_branch = await app_repo.getActiveBranch();
    await app_repo.checkout(version);
    const env_file_path = config.get("envs.environment_path") ?? "src/configuration/environment.ts";
    const env_file = app_repo.dir.getFile(env_file_path);
    if (!env_file.exists()) {
      log.warning(`Could not find env file for ${deployment.name}`);
      return { envs: [] };
    }

    const configMaps = await deployment.getConfigMaps() ?? [];
    const secrets = deployment.getSecrets() ?? [];
    const resources = await Promise.all([...secrets, ...configMaps].map((r) => r.getData()));
    const env = resources.filter((r) => r !== undefined).reduce((acc, curr) => ({ ...acc, ...curr }), {});
    const matches = Array.from(env_file.read().matchAll(/process\.env\..*/g)).map((m) => m[0].replace("process.env.", ""));
    const envs_exclusions = config.get("envs.health_exclusions") ?? [];
    const keys = matches
      .map((m) => m.split(" ")?.[0]?.replaceAll(",", "") ?? "")
      .filter((k) => !envs_exclusions.includes(k));

    const envs = [];
    for (const key of keys) {
      if (!env[key]) envs.push({ key, status: status.MISSING });
    }

    for (const key of Object.keys(env).filter((k) => !envs_exclusions.includes(k))) {
      if (!keys.includes(key)) envs.push({ key, status: status.UNUSED });
    }

    if (envs.length === 0) log.success(`${deployment.name} has no missing envs`);
    app_repo.switchBranchIfExists(active_branch);
    return { envs };
  }
}

