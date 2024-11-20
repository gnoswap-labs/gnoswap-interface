export function makeQueryParameter(data: {
  [key in string]: string | number | bigint | boolean | null | undefined;
}) {
  const params = Object.entries(data)
    .filter(([, value]) => value !== null && value !== undefined)
    .map(([key, value]) => {
      return `${key}=${value?.toString()}`;
    });

  if (params.length === 0) {
    return "";
  }

  return "?" + params.join("&");
}
