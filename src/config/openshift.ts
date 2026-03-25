import z from "zod/v4";

import { ExecutionContext, RuntimeConfig, APP_TYPES, ConfigHelp, ConfigSection } from "@maro/maro";

const serverSchema = z.object({
  username: z.string().optional(),
  password: z.string().optional(),
  url: z.string(),
  authUrl: z.string()
});

const schema = z.object({
  servers: z.record(z.string(), serverSchema),
  prod_servers: z.record(z.string(), serverSchema),
  cron_image_url: z.string().optional(),
  namespace_prefix: z.string().optional(),
  mf_host_template: z.string().optional(),
  project: z.string().optional(),
  product: z.string().optional(),
  default_ms_type: z.enum(APP_TYPES).optional(),
  username: z.string().optional(),
  password: z.string().optional(),
  status: z.object({
    mock_secrets: z.array(z.string()).optional(),
    exclusions: z.array(z.string())
  })
});

export class OpenShiftConfig implements ConfigSection {
  key = "openshift";

  defaults(): Record<string, unknown> {
    return {
      servers: {},
      status: {
        mock_secrets: [],
        exclusions: []
      },
      prod_servers: {}
    };
  }

  validate(config: unknown) {
    return schema.parse(config);
  }

  help(): ConfigHelp[] {
    return [
      { key: "username", description: "Default OpenShift username.", type: "object" },
      { key: "pasword", description: "Default OpenShift username.", type: "object" },
      { key: "servers", description: "OpenShift servers. Key is server name.", type: "object" },
      { key: "servers.username", description: "OpenShift username for server.", type: "object" },
      { key: "servers.password", description: "OpenShift password for server.", type: "object" },
      { key: "servers.url", description: "OpenShift server url.", type: "object" },
      { key: "servers.authUrl", description: "Openshift OAuth url", type: "object" },
      { key: "prod_servers", description: "OpenShift servers to use for prod", type: "object" },
      { key: "cron_image_url", description: "Image URL used in cronjobs", type: "string" },
      { key: "namespace_prefix", description: "Prefix applied to namespaces", type: "string" },
      { key: "mf_host_template", description: "Template used to build MF host names", type: "string" },
      { key: "project", description: "Project used to create apps", type: "string" },
      { key: "product", description: "Product label value for deployments", type: "string" },
      { key: "default_ms_type", description: "Default microservice type", type: "string" },
      { key: "status.mock_secrets", description: "Secrets that determine whether a service is mocked", type: "string[]" }
    ];
  }

  applyRuntime(runtime: RuntimeConfig, getKey: (k: string) => unknown) {
    if (runtime.prod) {
      return { servers: getKey("prod_servers") };
    }
    return {};
  }

  async setup(ctx: ExecutionContext) {
    const key = await ctx.ui.input({ message: "Enter a key to identify this OpenShift server (e.g., 'dev-example')" });
    const username = await ctx.ui.input({ message: "Enter OpenShift username" });
    const password = await ctx.ui.password({ message: "Enter OpenShift password" });
    const url = await ctx.ui.input({ message: "Enter OpenShift cluster API server url" });
    const authUrl = await ctx.ui.input({ message: "Enter OpenShift OAuth server url" });
    return {
      servers: {
        [key]: { username, password, url, authUrl }
      },
      prod_servers: {}
    };
  }

}

