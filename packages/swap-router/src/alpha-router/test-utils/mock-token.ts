import { ChainId, Gnot, Token, WGNOT } from "../core";
import { mapTokenByResponse } from "../providers/mapper/token-mapper";
import { TokenResponse } from "../providers/response/token-response";

export const GNOT_DEV = new Gnot(ChainId.DEV_GNOSWAP);

export const WGNOT_DEV = WGNOT[ChainId.DEV_GNOSWAP];

export const FOO_DEV = new Token(
  ChainId.DEV_GNOSWAP,
  "gno.land/r/demo/foo",
  6,
  "FOO",
  "FOO",
);

export const BAR_DEV = new Token(
  ChainId.DEV_GNOSWAP,
  "gno.land/r/demo/bar",
  6,
  "BAR",
  "BAR",
);

export const BAZ_DEV = new Token(
  ChainId.DEV_GNOSWAP,
  "gno.land/r/demo/baz",
  6,
  "BAZ",
  "BAZ",
);

const tokens = [
  {
    type: "grc20",
    chainId: "dev.gnoswap",
    createdAt: "2023-12-28T11:00:25Z",
    name: "Bar",
    path: "gno.land/r/demo/bar",
    decimals: 6,
    symbol: "BAR",
    logoURI:
      "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_bar.svg",
    priceId: "gno.land/r/demo/bar",
    description:
      "Bar is a GRC20 token issued solely with testing purpose. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nisi orci, ultrices sit amet mi eget, efficitur elementum tellus. Integer augue purus, rutrum eu pretium sit amet, varius in quam. In auctor gravida pretium. Maecenas est ante, pulvinar id accumsan eget, aliquam ac turpis. Donec vulputate nunc tellus. In sit amet mattis nisl. Mauris libero quam, hendrerit dapibus scelerisque eu, fringilla sit amet sapien. Proin ut semper risus. Vivamus fringilla eget lectus ut faucibus. Proin vitae mollis massa. Sed bibendum tortor eget aliquam commodo. Etiam et eleifend augue. Donec molestie placerat elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nisi orci, ultrices sit amet mi eget, efficitur elementum tellus. Integer augue purus, rutrum eu pretium sit amet, varius in quam. In auctor gravida pretium. Maecenas est ante, pulvinar id accumsan eget, aliquam ac turpis. Donec vulputate nunc tellus. In sit amet mattis nisl. Mauris libero quam, hendrerit dapibus scelerisque.",
    websiteURL: "https://beta.gnoswap.io",
    displayPath: "gno.land/r/demo/bar",
    wrappedPath: "gno.land/r/demo/bar",
  },
  {
    type: "grc20",
    chainId: "dev.gnoswap",
    createdAt: "2023-12-28T11:00:30Z",
    name: "Baz",
    path: "gno.land/r/demo/baz",
    decimals: 6,
    symbol: "BAZ",
    logoURI:
      "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_baz.svg",
    priceId: "gno.land/r/demo/baz",
    description: "Baz is a GRC20 token issued solely with testing purpose.",
    websiteURL: "https://beta.gnoswap.io",
    displayPath: "gno.land/r/demo/baz",
    wrappedPath: "gno.land/r/demo/baz",
  },
  {
    type: "grc20",
    chainId: "dev.gnoswap",
    createdAt: "2023-12-28T11:00:35Z",
    name: "Foo",
    path: "gno.land/r/demo/foo",
    decimals: 6,
    symbol: "FOO",
    logoURI:
      "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_foo.svg",
    priceId: "gno.land/r/demo/foo",
    description:
      "Foo is a GRC20 token issued solely with testing purpose. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nisi orci, ultrices sit amet mi eget, efficitur elementum tellus. Integer augue purus, rutrum eu pretium sit amet, varius in quam. In auctor gravida pretium. Maecenas est ante, pulvinar id accumsan eget, aliquam ac turpis. Donec vulputate nunc tellus. In sit amet mattis nisl. Mauris libero quam, hendrerit dapibus scelerisque eu, fringilla sit amet sapien. Proin ut semper risus. Vivamus fringilla eget lectus ut faucibus. Proin vitae mollis massa. Sed bibendum tortor eget aliquam commodo. Etiam et eleifend augue. Donec molestie placerat elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nisi orci, ultrices sit amet mi eget, efficitur elementum tellus. Integer augue purus, rutrum eu pretium sit amet, varius in quam. In auctor gravida pretium. Maecenas est ante, pulvinar id accumsan eget, aliquam ac turpis. Donec vulputate nunc tellus. In sit amet mattis nisl. Mauris libero quam, hendrerit dapibus scelerisque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nisi orci, ultrices sit amet mi eget, efficitur elementum tellus. Integer augue purus, rutrum eu pretium sit amet, varius in quam. In auctor gravida pretium. Maecenas est ante, pulvinar id accumsan eget, aliquam ac turpis. Donec vulputate nunc tellus. In sit amet mattis nisl. Mauris libero quam, hendrerit dapibus scelerisque eu, fringilla sit amet sapien. Proin ut semper risus. Vivamus fringilla eget lectus ut faucibus. Proin vitae mollis massa. Sed bibendum tortor eget aliquam commodo. Etiam et eleifend augue. Donec molestie placerat elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nisi orci, ultrices sit amet mi eget, efficitur elementum tellus. Integer augue purus, rutrum eu pretium sit amet, varius in quam. In auctor gravida pretium. Maecenas est ante, pulvinar id accumsan eget, aliquam ac turpis. Donec vulputate nunc tellus. In sit amet mattis nisl. Mauris libero quam, hendrerit dapibus scelerisque.",
    websiteURL: "https://beta.gnoswap.io",
    displayPath: "gno.land/r/demo/foo",
    wrappedPath: "gno.land/r/demo/foo",
  },
  {
    type: "grc20",
    chainId: "dev.gnoswap",
    createdAt: "2023-12-28T11:00:45Z",
    name: "Fred",
    path: "gno.land/r/demo/fred",
    decimals: 6,
    symbol: "FRED",
    logoURI:
      "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_fred.svg",
    priceId: "gno.land/r/demo/fred",
    description: "FRED is a GRC20 token issued solely for testing purposes.",
    websiteURL: "https://beta.gnoswap.io",
    displayPath: "gno.land/r/demo/fred",
    wrappedPath: "gno.land/r/demo/fred",
  },
  {
    type: "grc20",
    chainId: "dev.gnoswap",
    createdAt: "2023-12-28T11:00:20Z",
    name: "Gnoswap",
    path: "gno.land/r/demo/gns",
    decimals: 6,
    symbol: "GNS",
    logoURI:
      "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_gns.svg",
    priceId: "gno.land/r/demo/gns",
    description: "GNS is a GRC20 token issued solely for testing purposes.",
    websiteURL: "https://beta.gnoswap.io",
    displayPath: "gno.land/r/demo/gns",
    wrappedPath: "gno.land/r/demo/gns",
  },
  {
    type: "grc20",
    chainId: "dev.gnoswap",
    createdAt: "2023-12-28T11:00:50Z",
    name: "OnblocToken",
    path: "gno.land/r/demo/obl",
    decimals: 6,
    symbol: "OBL",
    logoURI:
      "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_obl.svg",
    priceId: "gno.land/r/demo/obl",
    description: "OBL is a GRC20 token issued solely for testing purposes.",
    websiteURL: "https://beta.gnoswap.io",
    displayPath: "gno.land/r/demo/obl",
    wrappedPath: "gno.land/r/demo/obl",
  },
  {
    type: "grc20",
    chainId: "dev.gnoswap",
    createdAt: "2023-12-28T11:00:40Z",
    name: "Qux",
    path: "gno.land/r/demo/qux",
    decimals: 6,
    symbol: "QUX",
    logoURI:
      "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_qux.svg",
    priceId: "gno.land/r/demo/qux",
    description: "Qux is a GRC20 token issued solely with testing purpose.",
    websiteURL: "https://beta.gnoswap.io",
    displayPath: "gno.land/r/demo/qux",
    wrappedPath: "gno.land/r/demo/qux",
  },
  {
    type: "grc20",
    chainId: "dev.gnoswap",
    createdAt: "2023-12-28T11:00:55Z",
    name: "Thud",
    path: "gno.land/r/demo/thud",
    decimals: 6,
    symbol: "THUD",
    logoURI:
      "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_thud.svg",
    priceId: "gno.land/r/demo/thud",
    description: "THUD is a GRC20 token issued solely for testing purposes.",
    websiteURL: "https://beta.gnoswap.io",
    displayPath: "gno.land/r/demo/thud",
    wrappedPath: "gno.land/r/demo/thud",
  },
  {
    type: "grc20",
    chainId: "dev.gnoswap",
    createdAt: "2023-12-28T11:00:15Z",
    name: "WrappedGNOT",
    path: "gno.land/r/demo/wugnot",
    decimals: 6,
    symbol: "WGNOT",
    logoURI:
      "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_wgnot.svg",
    priceId: "gno.land/r/demo/wugnot",
    description:
      "WGNOT is a GRC20 token issued solely with testing purpose. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nisi orci, ultrices sit amet mi eget, efficitur elementum tellus. Integer augue purus, rutrum eu pretium sit amet, varius in quam. In auctor gravida pretium. Maecenas est ante, pulvinar id accumsan eget, aliquam ac turpis. Donec vulputate nunc tellus. In sit amet mattis nisl. Mauris libero quam, hendrerit dapibus scelerisque eu, fringilla sit amet sapien. Proin ut semper risus. Vivamus fringilla eget lectus ut faucibus. Proin vitae mollis massa. Sed bibendum tortor eget aliquam commodo. Etiam et eleifend augue. Donec molestie placerat elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nisi orci, ultrices sit amet mi eget, efficitur elementum tellus. Integer augue purus, rutrum eu pretium sit amet, varius in quam. In auctor gravida pretium. Maecenas est ante, pulvinar id accumsan eget, aliquam ac turpis. Donec vulputate nunc tellus. In sit amet mattis nisl. Mauris libero quam, hendrerit dapibus scelerisque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nisi orci, ultrices sit amet mi eget, efficitur elementum tellus. Integer augue purus, rutrum eu pretium sit amet, varius in quam. In auctor gravida pretium. Maecenas est ante, pulvinar id accumsan eget, aliquam ac turpis. Donec vulputate nunc tellus. In sit amet mattis nisl. Mauris libero quam, hendrerit dapibus scelerisque eu, fringilla sit amet sapien. Proin ut semper risus. Vivamus fringilla eget lectus ut faucibus. Proin vitae mollis massa. Sed bibendum tortor eget aliquam commodo. Etiam et eleifend augue. Donec molestie placerat elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nisi orci, ultrices sit amet mi eget, efficitur elementum tellus. Integer augue purus, rutrum eu pretium sit amet, varius in quam. In auctor gravida pretium. Maecenas est ante, pulvinar id accumsan eget, aliquam ac turpis. Donec vulputate nunc tellus. In sit amet mattis nisl. Mauris libero quam, hendrerit dapibus scelerisque.",
    websiteURL: "https://beta.gnoswap.io",
    displayPath: "gno.land/r/demo/wugnot",
    wrappedPath: "gno.land/r/demo/wugnot",
  },
  {
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
    displayPath: "Native",
    wrappedPath: "gno.land/r/demo/wugnot",
  },
];

export const MOCK_TOKENS = tokens.map(token =>
  mapTokenByResponse(token as TokenResponse),
);
