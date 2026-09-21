import { Any } from "@gnolang/tm2-js-client";

/**
 * Amino type URL of `chain.StorageDepositEvent`, emitted once per realm whose
 * storage grew during a transaction. The `tm` prefix comes from the amino
 * package registration of `gnovm/stdlibs/chain`.
 */
export const STORAGE_DEPOSIT_EVENT_TYPE_URL = "/tm.StorageDepositEvent";

const WIRE_TYPE_VARINT = 0;
const WIRE_TYPE_FIXED64 = 1;
const WIRE_TYPE_LENGTH_DELIMITED = 2;
const WIRE_TYPE_FIXED32 = 5;

const STORAGE_DEPOSIT_FEE_DELTA_FIELD = 2;
const COIN_AMOUNT_FIELD = 2;

interface Cursor {
  offset: number;
}

function readUvarint(bytes: Uint8Array, cursor: Cursor): bigint {
  let value = 0n;
  let shift = 0n;

  while (cursor.offset < bytes.length) {
    const byte = bytes[cursor.offset];
    cursor.offset += 1;

    value |= BigInt(byte & 0x7f) << shift;
    if ((byte & 0x80) === 0) return value;

    shift += 7n;
  }

  throw new Error("truncated varint");
}

// amino encodes int64 as a zigzag varint, which is protobuf's sint64.
function readZigzagVarint(bytes: Uint8Array, cursor: Cursor): bigint {
  const raw = readUvarint(bytes, cursor);

  return (raw >> 1n) ^ -(raw & 1n);
}

function skipValue(bytes: Uint8Array, cursor: Cursor, wireType: number): void {
  switch (wireType) {
    case WIRE_TYPE_VARINT:
      readUvarint(bytes, cursor);
      return;
    case WIRE_TYPE_FIXED64:
      cursor.offset += 8;
      return;
    case WIRE_TYPE_LENGTH_DELIMITED: {
      // Read the length before advancing: `+=` would capture the offset from
      // before readUvarint moved the cursor past the length itself.
      const length = Number(readUvarint(bytes, cursor));
      cursor.offset += length;
      return;
    }
    case WIRE_TYPE_FIXED32:
      cursor.offset += 4;
      return;
    default:
      throw new Error(`unsupported wire type ${wireType}`);
  }
}

function readCoinAmount(bytes: Uint8Array): bigint {
  const cursor: Cursor = { offset: 0 };

  while (cursor.offset < bytes.length) {
    const tag = readUvarint(bytes, cursor);
    const field = Number(tag >> 3n);
    const wireType = Number(tag & 7n);

    if (field === COIN_AMOUNT_FIELD && wireType === WIRE_TYPE_VARINT) {
      return readZigzagVarint(bytes, cursor);
    }

    skipValue(bytes, cursor, wireType);
  }

  return 0n;
}

/** Reads the `fee_delta` amount of a single encoded `StorageDepositEvent`. */
export function readStorageDepositEventFee(value: Uint8Array): bigint {
  const cursor: Cursor = { offset: 0 };

  while (cursor.offset < value.length) {
    const tag = readUvarint(value, cursor);
    const field = Number(tag >> 3n);
    const wireType = Number(tag & 7n);

    if (field === STORAGE_DEPOSIT_FEE_DELTA_FIELD && wireType === WIRE_TYPE_LENGTH_DELIMITED) {
      const length = Number(readUvarint(value, cursor));
      const coin = value.subarray(cursor.offset, cursor.offset + length);
      cursor.offset += length;

      return readCoinAmount(coin);
    }

    skipValue(value, cursor, wireType);
  }

  return 0n;
}

/**
 * Total storage deposit, in ugnot, that the transaction would lock.
 *
 * Deposits are locked per realm, so a transaction touching several realms emits
 * several events. Undecodable events are skipped rather than failing the whole
 * estimate, since an under-reported deposit is caught by the verification pass.
 */
export function sumStorageDeposit(events: Any[] | undefined): number {
  if (!events?.length) return 0;

  return events.reduce((total, event) => {
    if (event.type_url !== STORAGE_DEPOSIT_EVENT_TYPE_URL) return total;

    try {
      return total + Number(readStorageDepositEventFee(event.value));
    } catch {
      return total;
    }
  }, 0);
}
