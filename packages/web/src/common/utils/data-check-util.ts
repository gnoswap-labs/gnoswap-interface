const TYPE_NAMES = {
  String: "String",
  Number: "Number",
  Boolean: "Boolean",
  Array: "Array",
  Object: "Object",
  Null: "Null",
  Undefined: "Undefined",
  Function: "Function",
  Date: "Date",
  RegExp: "RegExp",
} as const;

type TypeName = (typeof TYPE_NAMES)[keyof typeof TYPE_NAMES];

// Type-safe getType function with union return type
export const getType = (target: unknown): TypeName => {
  const typeString = Object.prototype.toString.call(target);
  const match = typeString.match(/\[object (\w+)\]/);
  return (match?.[1] || "Unknown") as TypeName;
};

// Explicit return type
export const emptyStrCheckAfterTrim = (str: string): boolean => {
  return Boolean(str.trim());
};

// Type guard with proper type predicate
export const isNotNullOrUndefined = <T>(target: T | null | undefined): target is T => {
  return target !== null && target !== undefined;
};

// Type guard for string type
export const isNotNullString = (value: unknown): value is string => {
  return getType(value) === TYPE_NAMES.String && isNotNullOrUndefined(value);
};

// Type guard for non-empty string
export const isNonEmptyString = (value: unknown): value is string => {
  return isNotNullString(value) && emptyStrCheckAfterTrim(value);
};

// Enum for decimal separator types
enum DecimalSeparator {
  DOT = ".",
  COMMA = ",",
}

// Result type for amount validation
interface AmountValidationResult {
  isValid: boolean;
  separator?: DecimalSeparator;
  integerPart?: string;
  decimalPart?: string;
}

// Enhanced amount validation with detailed result
export const validateAmount = (str: string): AmountValidationResult => {
  const dotRegex = /^(\d+)(\.(\d*))?$/;
  const commaRegex = /^(\d+)(,(\d*))?$/;

  const dotMatch = str.match(dotRegex);
  if (dotMatch) {
    return {
      isValid: true,
      separator: DecimalSeparator.DOT,
      integerPart: dotMatch[1],
      decimalPart: dotMatch[3],
    };
  }

  const commaMatch = str.match(commaRegex);
  if (commaMatch) {
    return {
      isValid: true,
      separator: DecimalSeparator.COMMA,
      integerPart: commaMatch[1],
      decimalPart: commaMatch[3],
    };
  }

  return { isValid: false };
};

// Simplified isAmount for backward compatibility
export const isAmount = (str: string): boolean => {
  return validateAmount(str).isValid;
};

// Type guard for numeric strings
export const isNumericString = (value: unknown): value is string => {
  if (typeof value !== "string") return false;
  if (value.trim() === "") return false;
  // Exclude special values
  if (value === "NaN" || value === "Infinity" || value === "-Infinity") return false;
  return !isNaN(Number(value)) && !isNaN(parseFloat(value));
};

// Type guard for positive numbers
export const isPositiveNumber = (value: unknown): value is number => {
  return typeof value === "number" && value > 0 && !isNaN(value) && isFinite(value);
};

// Generic type guard for arrays
export const isArrayOf = <T>(value: unknown, itemGuard: (item: unknown) => item is T): value is T[] => {
  return Array.isArray(value) && value.every(itemGuard);
};
