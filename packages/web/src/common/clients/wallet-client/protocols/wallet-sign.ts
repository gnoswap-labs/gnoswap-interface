import { WalletResponse } from "./wallet-response";

export interface WalletSignMethod {
  /**
   * Signs arbitrary UTF-8 data off-chain (ADR-036) to prove control of `signer`.
   */
  signArbitrary: (request: SignArbitraryRequestParam) => Promise<WalletResponse<SignedArbitraryData>>;
}

export interface SignArbitraryRequestParam {
  /** Address expected to sign; the wallet refuses with ACCOUNT_MISMATCH otherwise. */
  signer: string;
  /** UTF-8 text shown to the user and signed as-is. */
  data: string;
}

/**
 * Proof returned by SignArbitrary: the ADR-036 document that was signed and the signature over it.
 */
export interface SignedArbitraryData {
  signed: Record<string, unknown>;
  signature: {
    pubKey: {
      /** `/tm.PubKeySecp256k1` */
      typeUrl: string;
      /** Base64 of the Secp256k1 public key. */
      value: string;
    };
    /** Base64 of the 64-byte `r || s` signature. */
    signature: string;
  };
}
