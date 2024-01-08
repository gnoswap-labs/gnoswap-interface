import { TokenModel } from "@models/token/token-model";

export const GNOT_TOKEN: TokenModel = {
  type: "native",
  chainId: "",
  createdAt: "0001-01-01T00:00:00Z",
  name: "Gnoland",
  path: "gnot",
  decimals: 6,
  symbol: "GNOT",
  logoURI:
    "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/gnot.svg",
  priceId: "gnot",
  address: "",
};

export const GNOT_SYMBOL = "GNOT";
export const GNS_SYMBOL = "GNOT";
export const BAR_SYMBOL = "GNOT";
export const BAZ_SYMBOL = "GNOT";

export const GNOT_TOKEN_DEFAULT: TokenModel = {
  type: "native",
  chainId: "dev.gnoswap",
  createdAt: "0001-01-01T00:00:00Z",
  name: "Gnoland",
  path: "gnot",
  decimals: 6,
  symbol: "GNOT",
  logoURI:
    "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/gnot.svg",
  priceId: "gnot",
  description:
    "Gno.land is a platform to write smart contracts in Gnolang (Gno). Using an interpreted version of the general-purpose programming language Golang (Go), developers can write smart contracts and other blockchain apps without having to learn a language that’s exclusive to a single ecosystem. Web2 developers can easily contribute to web3 and start building a more transparent, accountable world.\n\nThe Gno transaction token, GNOT, and the contributor memberships power the platform, which runs on a variation of Proof of Stake. Proof of Contribution rewards contributors from technical and non-technical backgrounds, fairly and for life with GNOT. This consensus mechanism also achieves higher security with fewer validators, optimizing resources for a greener, more sustainable, and enduring blockchain ecosystem.\n\nAny blockchain using Gnolang achieves succinctness, composability, expressivity, and completeness not found in any other smart contract platform. By observing a minimal structure, the design can endure over time and challenge the regime of information censorship we’re living in today.",
  websiteURL: "https://gno.land/",
  wrappedPath: "gno.land/r/demo/wugnot",
};