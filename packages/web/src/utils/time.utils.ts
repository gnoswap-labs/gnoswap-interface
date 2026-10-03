/**
 * Union of accepted time-like inputs.
 *
 * @remark
 * - `string`: must match one of the accepted formats described in {@link safeParseTime}.
 * - `number`: interpreted as epoch miliseconds (ms).
 * - `Date`: returns `data.getTime()` (already UTC-based).
 * - `null | undefined`: yields `null`.
 */
type TimeInput = string | number | Date | null | undefined;

/** @internal */
const isLeapYear = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

/** @internal */
const validYMD = (y: number, m1: number, d: number): boolean => {
  if (m1 < 0 || m1 > 11) return false;
  if (d < 1) return false;
  const dim = [31, isLeapYear(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m1];
  return d <= dim;
};

/**
 * Parses a variety of inputs into a **UTC epoch milliseconds** timestamp.
 * Returns `null` for invalid or unsupported inputs.
 *
 * @param input - A time-like value to parse. See {@link TimeInput}
 * @returns The UTC epoch milliseconds, or `null` when parsing/validation fails
 *
 * @example
 * ```ts
 * safeParseTime("2024-01-15T10:30:00Z"); // epoch ms (number)
 * ```
 * @example
 * ```ts
 * // Numeric string: seconds vs milliseconds
 * safeParseTime("1705315800");    // 1705315800000 (seconds → ms)
 * safeParseTime("1705315800000"); // 1705315800000 (already ms)
 * ```
 * @example
 * ```ts
 * // Date-only is fixed to UTC midnight
 * safeParseTime("2024-01-15"); // Date.UTC(2024, 0, 15)
 * ```
 * @example
 * ```ts
 * // Ambiguous local date-time (no offset) is rejected
 * safeParseTime("2024-01-15T10:30:00"); // null
 * ```
 */
export const safeParseTime = (input: TimeInput): number | null => {
  if (input == null) return null;

  // Reject clearly unsupported types before any coercion
  const t = typeof input;
  if (t === "boolean" || t === "function" || t === "symbol" || t === "bigint") {
    return null;
  }
  if (Array.isArray(input)) return null;

  // Date instance
  if (input instanceof Date) {
    const ms = input.getTime();
    return Number.isFinite(ms) ? ms : null;
  }

  // number -> epoch ms
  if (t === "number") {
    if (!Number.isFinite(input)) return null;
    const ms = Number(input);
    const d = new Date(ms);
    return Number.isNaN(d.getTime()) ? null : ms;
  }

  if (t === "string") {
    const s = (input as string).trim();
    if (s === "") return null;

    // numeric-only string: seconds vs milliseconds policy
    //
    // Note: In tests, `new Date(date.toUTCString()).getTime()` is used to compare values
    // in milliseconds. Therefore, we have consistently converted to ms form.
    if (/^\d+$/.test(s)) {
      const n = Number(s);
      if (!Number.isFinite(n)) return null;
      // length is stable and cheaper than numeric threshold
      // 11-digit seconds won't appear in real life for millennia.
      const ms = s.length <= 10 ? n * 1000 : n;
      const d = new Date(ms);
      return Number.isNaN(d.getTime()) ? null : ms;
    }

    // YYYY-MM-DD
    const mDateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (mDateOnly) {
      const y = Number(mDateOnly[1]);
      const m1 = Number(mDateOnly[2]) - 1;
      const d = Number(mDateOnly[3]);
      if (!validYMD(y, m1, d)) return null;
      return Date.UTC(y, m1, d, 0, 0, 0, 0); // fixed to UTC midnight
    }

    // ISO 8601 / RFC3339 with Z or explicit offset
    const mISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|[+\-]\d{2}:\d{2})$/.exec(s);
    if (mISO) {
      const y = Number(mISO[1]);
      const m1 = Number(mISO[2]) - 1; // subtract 1 to convert to 0-indexed month
      const d = Number(mISO[3]);
      const hh = Number(mISO[4]);
      const mm = Number(mISO[5]);
      const ss = Number(mISO[6]);

      // validate Data's overflow normalization from invalid calendar values
      if (!validYMD(y, m1, d)) return null;
      if (hh > 23 || mm > 59 || ss > 59) return null;
      const ms = Date.parse(s);
      return Number.isNaN(ms) ? null : ms;
    }

    // Reject anything else to avoid engine-dependent parsing.
    // Browser/engines may parse free-form data strings differently.
    return null;
  }

  // plain objects (non-Date) and other unknowns
  return null;
};
