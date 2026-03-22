import axios from "axios";

import { EXCLUDED_SECRETS } from "../constants";
import { Secret } from "./secret";

export const oc = (token: string, url: string) => {
  return axios.create({
    baseURL: url,
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const filterExcludedSecrets = (s: Secret) => !EXCLUDED_SECRETS.includes(s.name);
//                                      (cm :Configmap)
export const filterExcludedConfigmaps = () => true;

