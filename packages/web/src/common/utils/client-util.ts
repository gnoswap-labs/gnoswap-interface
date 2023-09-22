export const DEFAULT_TIMEOUT = 15 * 60 * 1000;

export async function createTimeout<T>(
  promise: Promise<T>,
  milliseconds?: number,
): Promise<T> {
  milliseconds = milliseconds ?? DEFAULT_TIMEOUT;
  let timer: number | NodeJS.Timeout;
  const response = await Promise.race([
    promise,
    new Promise<"timeout">(resolve => {
      timer = setTimeout(() => resolve("timeout"), milliseconds);
    }),
  ] as const).finally(() => clearTimeout(timer));

  if (response === "timeout") {
    throw new Error("Adena timeout");
  }
  return response;
}
