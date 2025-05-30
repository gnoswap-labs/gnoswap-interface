import { ValuesType } from "utility-types";

export const TOKEN_PRICE_GRADE_TYPE = {
  ORACLE: "ORACLE",
  INFORMATIONAL: "INFORMATIONAL",
  NONE: "NONE",
} as const;

export type TOKEN_PRICE_GRADE_TYPE = ValuesType<typeof TOKEN_PRICE_GRADE_TYPE>;
