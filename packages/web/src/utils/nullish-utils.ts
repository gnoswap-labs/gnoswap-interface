export const nullish = {
  // Basic null/undefined handling
  handle: <T>(value: T | null | undefined, defaultValue: T): T => {
    return value ?? defaultValue;
  },

  // Handle all falsy values
  handleFalsy: <T>(value: T | null | undefined, defaultValue: T): T => {
    if (!value) {
      return defaultValue;
    }

    return value;
  },
};
