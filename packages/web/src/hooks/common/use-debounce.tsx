import React from "react";

const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  // Keep the latest `value` in a ref so the debounce effect doesn't have to
  // depend on `value` by reference. A caller passing a fresh object literal
  // every render would otherwise re-arm the timer endlessly (timer fires ->
  // setState -> re-render -> new object -> timer re-arms = a permanent loop).
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Drive the effect off a value-based key instead. For primitives this is the
  // value itself; for objects it's a stable serialization, so structurally
  // equal inputs across renders don't re-trigger the debounce. The replacer
  // stringifies `bigint`, which `JSON.stringify` would otherwise throw on.
  const valueKey =
    value !== null && typeof value === "object"
      ? JSON.stringify(value, (_, v) => (typeof v === "bigint" ? v.toString() : v))
      : value;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(valueRef.current);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [valueKey, delay]);

  return debouncedValue;
};

export default useDebounce;
