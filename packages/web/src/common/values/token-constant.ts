import { GNS_TOKEN_PATH, XGNS_TOKEN_PATH, WRAPPED_GNOT_PATH } from "@constants/environment.constant";
import { TokenModel } from "@models/token/token-model";

export const GNOT_UNIT_DENOM = "ugnot" as const;

export const GNS_TOKEN: TokenModel = {
  type: "GRC20",
  chainId: "dev.gnoswap",
  createdAt: "2024-01-24T15:12:21Z",
  name: "GnoSwap",
  path: GNS_TOKEN_PATH,
  tokenId: `${GNS_TOKEN_PATH}.GNS`,
  decimals: 6,
  symbol: "GNS",
  displaySymbol: "GNS",
  logoURI: "/gns.svg",
  priceID: GNS_TOKEN_PATH,
  description: "GNS is a GRC20 token issued solely for testing purposes.",
  websiteURL: "https://beta.gnoswap.io",
  wrappedPath: GNS_TOKEN_PATH,
};

export const XGNS_TOKEN: TokenModel = {
  type: "GRC20",
  chainId: "dev.gnoswap",
  createdAt: "0001-01-01T00:00:00Z",
  name: "GnoSwap",
  path: XGNS_TOKEN_PATH,
  tokenId: `${XGNS_TOKEN_PATH}.xGNS`,
  decimals: 6,
  symbol: "xGNS",
  displaySymbol: "xGNS",
  logoURI: "/xgns.svg",
  priceID: XGNS_TOKEN_PATH,
  description: "xGNS is a GRC20 token issued by delegating GNS.",
  websiteURL: "https://beta.gnoswap.io/governance",
};

export const GNOT_TOKEN: TokenModel = {
  type: "Native",
  chainId: "",
  createdAt: "0001-01-01T00:00:00Z",
  name: "Gno.land",
  path: "ugnot",
  tokenId: "ugnot",
  wrappedPath: WRAPPED_GNOT_PATH,
  decimals: 6,
  symbol: "GNOT",
  displaySymbol: "GNOT",
  logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/ugnot.svg",
  priceID: "ugnot",
  address: "",
};

export const GNOT_TOKEN_DEFAULT: TokenModel = {
  type: "Native",
  chainId: "dev.gnoswap",
  createdAt: "0001-01-01T00:00:00Z",
  name: "Gno.land",
  path: "ugnot",
  tokenId: "ugnot",
  wrappedPath: WRAPPED_GNOT_PATH,
  decimals: 6,
  symbol: "GNOT",
  displaySymbol: "GNOT",
  logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/ugnot.svg",
  priceID: "ugnot",
  description:
    "Gno.land is a platform to write smart contracts in Gnolang (Gno). Using an interpreted version of the general-purpose programming language Golang (Go), developers can write smart contracts and other blockchain apps without having to learn a language that’s exclusive to a single ecosystem. Web2 developers can easily contribute to web3 and start building a more transparent, accountable world.\n\nThe Gno transaction token, GNOT, and the contributor memberships power the platform, which runs on a variation of Proof of Stake. Proof of Contribution rewards contributors from technical and non-technical backgrounds, fairly and for life with GNOT. This consensus mechanism also achieves higher security with fewer validators, optimizing resources for a greener, more sustainable, and enduring blockchain ecosystem.\n\nAny blockchain using Gnolang achieves succinctness, composability, expressivity, and completeness not found in any other smart contract platform. By observing a minimal structure, the design can endure over time and challenge the regime of information censorship we’re living in today.",
  websiteURL: "https://gno.land/",
};

export const WUGNOT_TOKEN: TokenModel = {
  type: "GRC20",
  chainId: "portal-loop",
  name: "wrapped GNOT",
  path: "gno.land/r/gnoland/wugnot",
  tokenId: "gno.land/r/gnoland/wugnot.WUGNOT",
  decimals: 6,
  symbol: "WUGNOT",
  displaySymbol: "WUGNOT",
  logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_demo_wugnot.svg",
  priceID: "gno.land/r/gnoland/wugnot",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus nec nunc tincidunt ultricies. Nullam nec purus nec nunc tincidunt ultricies.",
  websiteURL: "https://gno.land/r/gnoland/wugnot",
  wrappedPath: "gno.land/r/gnoland/wugnot",
  createdAt: "0001-01-01T00:00:00Z",
};

export const LAUNCHPAD_DEFAULT_DEPOSIT_TOKEN = GNS_TOKEN.symbol || "";

export const GasToken: TokenModel & { denom: string } = {
  ...GNOT_TOKEN,
  denom: "ugnot",
};
