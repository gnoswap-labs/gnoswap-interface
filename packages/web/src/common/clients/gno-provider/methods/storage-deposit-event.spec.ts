import {
  readStorageDepositEventFee,
  STORAGE_DEPOSIT_EVENT_TYPE_URL,
  sumStorageDeposit,
} from "./storage-deposit-event";

const encodeUvarint = (value: number): number[] => {
  const bytes: number[] = [];
  let remaining = value;

  do {
    const byte = remaining & 0x7f;
    remaining >>>= 7;
    bytes.push(remaining > 0 ? byte | 0x80 : byte);
  } while (remaining > 0);

  return bytes;
};

const encodeZigzag = (value: number): number[] => encodeUvarint(value >= 0 ? value * 2 : -value * 2 - 1);

const encodeTag = (field: number, wireType: number): number[] => encodeUvarint((field << 3) | wireType);

const encodeString = (field: number, value: string): number[] => {
  const bytes = Array.from(new TextEncoder().encode(value));

  return [...encodeTag(field, 2), ...encodeUvarint(bytes.length), ...bytes];
};

/**
 * `std.Coin` marshals through `MarshalAmino` to `coin.String()`, so the field
 * holds `<amount><denom>` as text — and nothing at all when the amount is zero.
 */
const encodeCoin = (field: number, denom: string, amount: number): number[] =>
  amount === 0 ? [] : encodeString(field, `${amount}${denom}`);

const encodeStorageDepositEvent = ({
  bytesDelta,
  amount,
  pkgPath,
  denom = "ugnot",
}: {
  bytesDelta: number;
  amount: number;
  pkgPath: string;
  denom?: string;
}): Uint8Array =>
  new Uint8Array([
    ...encodeTag(1, 0),
    ...encodeZigzag(bytesDelta),
    ...encodeCoin(2, denom, amount),
    ...encodeString(3, pkgPath),
  ]);

const makeEvent = (value: Uint8Array, typeUrl = STORAGE_DEPOSIT_EVENT_TYPE_URL) => ({
  type_url: typeUrl,
  value,
});

/**
 * Captured from `.app/simulate` on the dev chain: wrapping GNOT grew
 * `gno.land/r/gnoland/wugnot` by 6 bytes, locking 600 ugnot at 100 ugnot a byte.
 */
const CHAIN_EVENT = Uint8Array.from(
  Buffer.from("080c120836303075676e6f741a19676e6f2e6c616e642f722f676e6f6c616e642f7775676e6f74", "hex"),
);

describe("readStorageDepositEventFee", () => {
  it("reads an event the chain actually emitted", () => {
    expect(readStorageDepositEventFee(CHAIN_EVENT)).toBe(600n);
  });

  it("matches what this spec encodes against that event", () => {
    const rebuilt = encodeStorageDepositEvent({
      bytesDelta: 6,
      amount: 600,
      pkgPath: "gno.land/r/gnoland/wugnot",
    });

    expect(Buffer.from(rebuilt).toString("hex")).toBe(Buffer.from(CHAIN_EVENT).toString("hex"));
  });

  it("ignores a coin in another denomination", () => {
    const value = encodeStorageDepositEvent({ bytesDelta: 6, amount: 600, pkgPath: "gno.land/r/x", denom: "ugns" });

    expect(readStorageDepositEventFee(value)).toBe(0n);
  });

  it("reads the locked amount out of an encoded event", () => {
    const value = encodeStorageDepositEvent({ bytesDelta: 1234, amount: 123_400, pkgPath: "gno.land/r/gnoswap/pool" });

    expect(readStorageDepositEventFee(value)).toBe(123_400n);
  });

  it("returns zero when the fee is omitted, as amino drops zero values", () => {
    const value = new Uint8Array([...encodeTag(1, 0), ...encodeZigzag(0), ...encodeString(3, "gno.land/r/x")]);

    expect(readStorageDepositEventFee(value)).toBe(0n);
  });

  it("skips fields declared before the fee", () => {
    const value = new Uint8Array([
      ...encodeTag(1, 0),
      ...encodeZigzag(-64),
      ...encodeCoin(2, "ugnot", 7),
      ...encodeString(3, "gno.land/r/x"),
    ]);

    expect(readStorageDepositEventFee(value)).toBe(7n);
  });

  it("throws on a truncated payload", () => {
    expect(() => readStorageDepositEventFee(new Uint8Array([0x08, 0x80]))).toThrow("truncated varint");
  });
});

describe("sumStorageDeposit", () => {
  it("returns zero without events", () => {
    expect(sumStorageDeposit(undefined)).toBe(0);
    expect(sumStorageDeposit([])).toBe(0);
  });

  it("adds up one event per realm the transaction grew", () => {
    const events = [
      makeEvent(encodeStorageDepositEvent({ bytesDelta: 100, amount: 10_000, pkgPath: "gno.land/r/a" })),
      makeEvent(encodeStorageDepositEvent({ bytesDelta: 250, amount: 25_000, pkgPath: "gno.land/r/b" })),
    ];

    expect(sumStorageDeposit(events)).toBe(35_000);
  });

  it("ignores events of any other type", () => {
    const events = [
      makeEvent(encodeStorageDepositEvent({ bytesDelta: 100, amount: 10_000, pkgPath: "gno.land/r/a" })),
      makeEvent(
        encodeStorageDepositEvent({ bytesDelta: -100, amount: 10_000, pkgPath: "gno.land/r/a" }),
        "/tm.StorageUnlockEvent",
      ),
    ];

    expect(sumStorageDeposit(events)).toBe(10_000);
  });

  it("skips an undecodable event rather than losing the whole estimate", () => {
    const events = [
      makeEvent(new Uint8Array([0x08, 0x80])),
      makeEvent(encodeStorageDepositEvent({ bytesDelta: 100, amount: 10_000, pkgPath: "gno.land/r/a" })),
    ];

    expect(sumStorageDeposit(events)).toBe(10_000);
  });
});
