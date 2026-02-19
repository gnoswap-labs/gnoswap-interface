import { nullish } from "./nullish-utils";

describe("nullish.handle", () => {
  const defaultValue = "default";

  test("returns value when value is a valid string", () => {
    expect(nullish.handle("hello", defaultValue)).toBe("hello");
  });

  test("returns value when value is 0", () => {
    expect(nullish.handle(0, 999)).toBe(0);
  });

  test("returns value when value is empty string", () => {
    expect(nullish.handle("", defaultValue)).toBe("");
  });

  test("returns value when value is false", () => {
    expect(nullish.handle(false, true)).toBe(false);
  });

  test("returns defaultValue when value is null", () => {
    expect(nullish.handle(null, defaultValue)).toBe(defaultValue);
  });

  test("returns defaultValue when value is undefined", () => {
    expect(nullish.handle(undefined, defaultValue)).toBe(defaultValue);
  });

  test("returns 0 instead of falling back to defaultValue", () => {
    expect(nullish.handle(0, 999)).toBe(0);
    expect(nullish.handle<number | undefined>(0, undefined)).toBe(0);
  });
});

describe("nullish.handleEmpty", () => {
  const defaultValue = "default";

  test("returns value when value is a non-empty string", () => {
    expect(nullish.handleEmpty("hello", defaultValue)).toBe("hello");
  });

  test("returns defaultValue when value is empty string", () => {
    expect(nullish.handleEmpty("", defaultValue)).toBe(defaultValue);
  });

  test("returns defaultValue when value is null", () => {
    expect(nullish.handleEmpty(null, defaultValue)).toBe(defaultValue);
  });

  test("returns defaultValue when value is undefined", () => {
    expect(nullish.handleEmpty(undefined, defaultValue)).toBe(defaultValue);
  });
});

describe("handle vs handleEmpty: type safety", () => {
  test("handle accepts any type, handleEmpty is restricted to strings", () => {
    // handle works with numbers — 0 is preserved
    expect(nullish.handle(0, 999)).toBe(0);

    // handleEmpty only accepts string | null | undefined
    // so numeric 0 can never accidentally be treated as empty
    expect(nullish.handleEmpty("0", "fallback")).toBe("0");
    expect(nullish.handleEmpty("", "fallback")).toBe("fallback");
  });
});
