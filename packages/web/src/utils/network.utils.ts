export function makeQueryParameter(data: {
  [key in string]: string | number | bigint;
}) {
  const params = Object.entries(data).map(([key, value]) => {
    return `${key}=${value.toString()}`;
  });

  if (params.length === 0) {
    return "";
  }

  return "?" + params.join("&");
}
