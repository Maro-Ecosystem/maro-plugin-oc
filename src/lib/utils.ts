export const base64Encode = (string: string) => Buffer.from(string).toString("base64");
export const base64Decode = (string: string) => Buffer.from(string, "base64").toString();

export function removeDuplicates<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function mapObject<
  T extends Record<PropertyKey, any>,
  K extends PropertyKey,
  V
>(
  obj: T,
  fn: (entry: [key: keyof T, value: T[keyof T]]) => readonly [K, V]
): Record<K, V> {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) =>
      fn([key as keyof T, value as T[keyof T]])
    )
  ) as Record<K, V>;
}

export function removeDuplicatesByKey<T>(arr: T[], getKey: (item: T) => string) {
  return Array.from(new Map(arr.map((item) => [getKey(item), item])).values());
}
