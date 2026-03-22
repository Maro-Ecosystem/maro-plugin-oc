export const base64Encode = (string: string) => Buffer.from(string).toString("base64");
export const base64Decode = (string: string) => Buffer.from(string, "base64").toString();

export function removeDuplicates<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


