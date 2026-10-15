import type { SignArbitraryOptions, SignedArbitraryData } from "@adena-wallet/sdk";

import { WalletResponse } from "./wallet-response";

/** `{ signer, data }`: the address expected to sign and the UTF-8 text signed as-is. */
export type SignArbitraryRequestParam = SignArbitraryOptions;

/** ADR-036 proof: the signed document and the signature over it. */
export type { SignedArbitraryData };

export interface WalletSignMethod {
  /**
   * Signs arbitrary UTF-8 data off-chain (ADR-036) to prove control of `signer`.
   */
  signArbitrary: (request: SignArbitraryRequestParam) => Promise<WalletResponse<SignedArbitraryData>>;
}
