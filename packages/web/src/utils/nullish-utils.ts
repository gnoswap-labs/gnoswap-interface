export const nullish = {
  /**
   * Returns `value` if it is neither `null` nor `undefined`; otherwise returns `defaultValue`.
   *
   * Uses the nullish coalescing operator (`??`) internally,
   * so falsy values like `0`, `""`, and `false` are preserved.
   */
  handle: <T>(value: T | null | undefined, defaultValue: T): T => {
    return value ?? defaultValue;
  },

  /**
   * Returns `value` if it is a non-empty string; otherwise returns `defaultValue`.
   *
   * Treats `null`, `undefined`, and `""` as empty.
   */
  handleEmpty: (value: string | null | undefined, defaultValue: string): string => {
    if (value == null || value === "") {
      return defaultValue;
    }

    return value;
  },
};
