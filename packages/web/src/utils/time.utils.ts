/**
 * Union of accepted time-like inputs.
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
    if (/^\d+$/.test(s)) {
      const n = Number(s);
      if (!Number.isFinite(n)) return null;
      const ms = s.length <= 10 ? n * 1000 : n; // <=10 digits -> seconds
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
      // validate calendar + time ranges before letting Date normalize
      if (!validYMD(y, m1, d)) return null;
      if (hh > 23 || mm > 59 || ss > 59) return null;
      const ms = Date.parse(s);
      return Number.isNaN(ms) ? null : ms;
    }

    // reject anything else to avoid engine-dependent parsing
    return null;
  }

  // plain objects (non-Date) and other unknowns
  return null;
};
