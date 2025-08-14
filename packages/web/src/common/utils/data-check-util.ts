/**
 * Type name constants for ECMAScript built-in types
 */
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
} as const satisfies Readonly<Record<string, string>>;

type TypeName = (typeof TYPE_NAMES)[keyof typeof TYPE_NAMES];

/**
 * Gets the precise type name of a value using Object.prototype.toString
 * @param target - The value to check
 * @returns The type name as a string (e.g., "String", "Number", "Array")
 * @example
 * getType("hello") // returns "String"
 * getType(123) // returns "Number"
 * getType([]) // returns "Array"
 */
export const getType = (target: unknown): TypeName => {
  const typeString = Object.prototype.toString.call(target);
  const match = typeString.match(/\[object (\w+)\]/);
  return (match?.[1] || "Unknown") as TypeName;
};

/**
 * Checks if a string is non-empty after trimming whitespace
 * @param str - The string to check
 * @returns true if the trimmed string is not empty, false otherwise
 * @example
 * emptyStrCheckAfterTrim("  hello  ") // returns true
 * emptyStrCheckAfterTrim("   ") // returns false
 */
export const emptyStrCheckAfterTrim = (str: string): boolean => {
  return Boolean(str.trim());
};

/**
 * Type guard that checks if a value is not null or undefined
 * @param target - The value to check
 * @returns true if the value is neither null nor undefined
 * @example
 * const value: string | null = getValue();
 * if (isNotNullOrUndefined(value)) {
 *   // value is now typed as string
 *   console.log(value.length);
 * }
 */
export const isNotNullOrUndefined = <T>(target: T | null | undefined): target is T => {
  return target !== null && target !== undefined;
};

/**
 * Type guard that checks if a value is a non-null string
 * @param value - The value to check
 * @returns true if the value is a string and not null/undefined
 * @example
 * if (isNotNullString(value)) {
 *   // value is now typed as string
 *   console.log(value.toUpperCase());
 * }
 */
export const isNotNullString = (value: unknown): value is string => {
  return getType(value) === TYPE_NAMES.String && isNotNullOrUndefined(value);
};

/**
 * Type guard that checks if a value is a non-empty string
 * @param value - The value to check
 * @returns true if the value is a string with content (not just whitespace)
 * @example
 * isNonEmptyString("hello") // returns true
 * isNonEmptyString("  ") // returns false
 * isNonEmptyString(null) // returns false
 */
export const isNonEmptyString = (value: unknown): value is string => {
  return isNotNullString(value) && emptyStrCheckAfterTrim(value);
};

/**
 * Type guard that checks if a value is an array
 * @param value - The value to check
 * @returns true if the value is an array, false otherwise
 * @example
 * isArray([1, 2, 3]) // returns true
 * isArray("hello") // returns false
 * isArray({ key: "value" }) // returns false
 * isArray(null) // returns false
 */
export const isArray = (value: unknown): value is unknown[] => {
  return getType(value) === TYPE_NAMES.Array;
};

/**
 * Decimal separator types used in number formatting
 */
enum DecimalSeparator {
  DOT = ".",
  COMMA = ",",
}

/**
 * Result of amount validation containing detailed parsing information
 */
interface AmountValidationResult {
  isValid: boolean;
  separator?: DecimalSeparator;
  integerPart?: string;
  decimalPart?: string;
}

/**
 * Validates and parses an amount string with support for both dot and comma separators
 * @param str - The amount string to validate
 * @returns Validation result with parsed components
 * @example
 * validateAmount("123.45") // returns { isValid: true, separator: ".", integerPart: "123", decimalPart: "45" }
 * validateAmount("123,45") // returns { isValid: true, separator: ",", integerPart: "123", decimalPart: "45" }
 * validateAmount("abc") // returns { isValid: false }
 */
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

/**
 * Checks if a string represents a valid amount (number with optional decimal)
 * @param str - The string to check
 * @returns true if the string is a valid amount format
 * @example
 * isAmount("123.45") // returns true
 * isAmount("123,45") // returns true
 * isAmount("abc") // returns false
 */
export const isAmount = (str: string): boolean => {
  return validateAmount(str).isValid;
};

/**
 * Type guard that checks if a value is a string that can be converted to a number
 * @param value - The value to check
 * @returns true if the value is a numeric string (excludes NaN, Infinity, etc.)
 * @example
 * isNumericString("123") // returns true
 * isNumericString("123.45") // returns true
 * isNumericString("NaN") // returns false
 * isNumericString("Infinity") // returns false
 */
export const isNumericString = (value: unknown): value is string => {
  if (typeof value !== "string") return false;
  if (value.trim() === "") return false;
  // Exclude special values
  if (value === "NaN" || value === "Infinity" || value === "-Infinity") return false;
  return !isNaN(Number(value)) && !isNaN(parseFloat(value));
};

/**
 * Type guard that checks if a value is a positive number
 * @param value - The value to check
 * @returns true if the value is a number greater than 0 and finite
 * @example
 * isPositiveNumber(10) // returns true
 * isPositiveNumber(0) // returns false
 * isPositiveNumber(-5) // returns false
 * isPositiveNumber(Infinity) // returns false
 */
export const isPositiveNumber = (value: unknown): value is number => {
  return typeof value === "number" && value > 0 && !isNaN(value) && isFinite(value);
};

/**
 * Generic type guard for checking if a value is an array of a specific type
 * @param value - The value to check
 * @param itemGuard - Type guard function for array items
 * @returns true if the value is an array and all items pass the type guard
 * @example
 * const isStringArray = (value: unknown): value is string[] =>
 *   isArrayOf(value, (item): item is string => typeof item === "string");
 *
 * isStringArray(["a", "b", "c"]) // returns true
 * isStringArray(["a", 1, "c"]) // returns false
 */
export const isArrayOf = <T>(value: unknown, itemGuard: (item: unknown) => item is T): value is T[] => {
  return Array.isArray(value) && value.every(itemGuard);
};
