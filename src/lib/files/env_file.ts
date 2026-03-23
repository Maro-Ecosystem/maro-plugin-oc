import { Config, EnvFile } from "@maro/maro";
import { mapObject } from "../utils";

export function toExternalEnv(str: string) {
  const config = Config.getView().get("openshift");
  return str
    .replaceAll(`.${config.namespace_prefix}`, `-${config.namespace_prefix}`)
    .replaceAll(".svc.cluster.local:8080", `.apps.${config.server_name}`);
}

export function toInternalEnv(str: string) {
  const config = Config.getView().get("openshift");
  return str
    .replaceAll(`-${config.namespace_prefix}`, `.${config.namespace_prefix}`)
    .replaceAll(`.apps.${config.server_name}`, ".svc.cluster.local:8080");
}

export class OcEnvFile extends EnvFile {

  external() {
    const content = this.read();
    const replaced = mapObject(content, ([key, value]) => [key, toExternalEnv(String(value))]);
    this.write(replaced);
  }

  internal() {
    const content = this.read();
    const replaced = mapObject(content, ([key, value]) => [key, toInternalEnv(String(value))]);
    this.write(replaced);
  }

}
