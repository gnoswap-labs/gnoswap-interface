export type ObjectStringValueType = {
  [key in string]: string;
};

export const YN_TYPE = {
  YES: "Y",
  NO: "N",
} as const;

export type YnType = (typeof YN_TYPE)[keyof typeof YN_TYPE];
