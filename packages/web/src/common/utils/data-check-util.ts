export const getType = (target: any) => {
  return Object.prototype.toString.call(target).slice(8, -1);
};

export const emptyStrCheckAfterTrim = (str: string) => {
  return Boolean(str.trim());
};

export const nullOrUndefinedCheck = (target: any) => {
  return target !== null && target !== undefined;
};

export const notNullStringType = (v: any) => {
  return getType(v) === "String" && nullOrUndefinedCheck(v);
};

export const notNullNumberType = (v: any) => {
  return getType(v) === "Number" && nullOrUndefinedCheck(v);
};

export const notEmptyStringType = (v: string) => {
  return notNullStringType(v) && emptyStrCheckAfterTrim(v);
};

export function isAmount(str: string) {
  console.log("🚀 ~ isAmount ~ str:", str);
  const regex = /^\d+(\.\d*)?$/;
  const regex2 = /^\d+(\,\d*)?$/;
  console.log("🚀 ~ isAmount ~ regex2:", regex2.test(str));
  return regex.test(str) || regex2.test(str);
}
