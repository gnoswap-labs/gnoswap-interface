export const removePoolPathUrl = (path: string) => {
  const regex = /:\d+$/;

  return path.replace(regex, "");
};
