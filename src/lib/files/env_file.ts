import { Config, EnvFile } from "@maro/maro";
import { mapObject } from "../utils";
import { OpenshiftServer } from "../oc/server";

export function toExternalEnv(str: string, server: OpenshiftServer) {
  const config = Config.getView().get("openshift");
  const host = server.host
  return str
    .replaceAll(`.${config.namespace_prefix}`, `-${config.namespace_prefix}`)
    .replaceAll(".svc.cluster.local:8080", host);
}

export function toInternalEnv(str: string, server: OpenshiftServer) {
  const host = server.host
  const config = Config.getView().get("openshift");
  return str
    .replaceAll(`-${config.namespace_prefix}`, `.${config.namespace_prefix}`)
    .replaceAll(host, ".svc.cluster.local:8080");
}

export class OcEnvFile extends EnvFile {
  server: OpenshiftServer

  constructor(path: string, server: OpenshiftServer) {
    super(path);
    this.server = server;
  }

  external() {
    const content = this.read();
    const replaced = mapObject(content, ([key, value]) => [key, toExternalEnv(String(value), this.server)]);
    this.write(replaced);
  }

  internal() {
    const content = this.read();
    const replaced = mapObject(content, ([key, value]) => [key, toInternalEnv(String(value), this.server)]);
    this.write(replaced);
  }

}
