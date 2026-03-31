import { OcEnvFile } from "../../lib/files/env_file";
import { OpenshiftServer, Project } from "../../lib";

import { AppRepo, ExecutionContext, WorkflowStep } from "@maro/maro";

type Reads = {
  app_repo: AppRepo;
  server: OpenshiftServer;
  project: Project;
};

export class CopyEnv extends WorkflowStep<Reads> {
  async run(_: ExecutionContext, { app_repo, project, server }: Reads) {
    const { name } = await app_repo.getInfo();
    const deployment = await project.getDeployment(name);
    const configMaps = await deployment.getConfigMaps() ?? [];
    const secrets = deployment.getSecrets() ?? [];
    const env = new OcEnvFile(app_repo.env.path, server);
    env.delete();

    for (const r of [...secrets, ...configMaps]) {
      for (const [key, value] of Object.entries(await r.getData() ?? {})) {
        env.add(key, value);
      }
    }

    const extraEnvs = {
      STDOUT_LOGS: "on"
    };

    Object.entries(extraEnvs).forEach(([key, value]) => {
      env.remove(key);
      env.add(key, value);
    });
    env.external();
    return {};
  }
}

