import { TokenModel } from "@models/token/token-model";

export const GNS_TOKEN: TokenModel = {
  type: "grc20",
  chainId: "dev.gnoswap",
  createdAt: "2024-01-24T15:12:21Z",
  name: "Gnoswap",
  path: "gno.land/r/demo/gns",
  decimals: 6,
  symbol: "GNS",
  logoURI:
    "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_gns.svg",
  priceID: "gno.land/r/demo/gns",
  description: "GNS is a GRC20 token issued solely for testing purposes.",
  websiteURL: "https://beta.gnoswap.io",
  wrappedPath: "gno.land/r/demo/gns",
};

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
  priceID: "gnot",
  address: "",
};

export const GNOT_SYMBOL = "GNOT";
export const GNS_SYMBOL = "GNS";
export const WUGNOT_SYMBOL = "wugnot";

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
  priceID: "gnot",
  description:
    "Gno.land is a platform to write smart contracts in Gnolang (Gno). Using an interpreted version of the general-purpose programming language Golang (Go), developers can write smart contracts and other blockchain apps without having to learn a language that’s exclusive to a single ecosystem. Web2 developers can easily contribute to web3 and start building a more transparent, accountable world.\n\nThe Gno transaction token, GNOT, and the contributor memberships power the platform, which runs on a variation of Proof of Stake. Proof of Contribution rewards contributors from technical and non-technical backgrounds, fairly and for life with GNOT. This consensus mechanism also achieves higher security with fewer validators, optimizing resources for a greener, more sustainable, and enduring blockchain ecosystem.\n\nAny blockchain using Gnolang achieves succinctness, composability, expressivity, and completeness not found in any other smart contract platform. By observing a minimal structure, the design can endure over time and challenge the regime of information censorship we’re living in today.",
  websiteURL: "https://gno.land/",
  wrappedPath: "gno.land/r/demo/wugnot",
};

export const WUGNOT_TOKEN: TokenModel = {
  "type": "grc20",
  "chainId": "portal-loop",
  "name": "wrapped GNOT",
  "path": "gno.land/r/demo/wugnot",
  "decimals": 6,
  "symbol": "WUGNOT",
  "logoURI": "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_demo_wugnot.svg",
  "priceID": "gno.land/r/demo/wugnot",
  "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc tincidunt ultricies. Nullam nec purus nec nunc tincidunt ultricies.",
  "websiteURL": "https://gno.land/r/demo/wugnot",
  "wrappedPath": "gno.land/r/demo/wugnot",
  "createdAt": "0001-01-01T00:00:00Z"
};
