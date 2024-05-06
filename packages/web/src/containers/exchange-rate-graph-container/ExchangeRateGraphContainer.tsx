import ExchangeRateGraph from "@components/pool/exchange-rate-graph/ExchangeRateGraph";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { TokenExchangeRateGraphResponse } from "@repositories/token/response/token-exchange-rate-response";
import { useQuery } from "@tanstack/react-query";

const ExchangeRateGraphContainer: React.FC = () => {
  const { tokenRepository } = useGnoswapContext();

  const { data: exchangeRateGraphData } = useQuery<TokenExchangeRateGraphResponse>({
    queryKey: ["exchange-rate-"],
    queryFn: tokenRepository.getExchangeRateGraph,
  });

  return (<ExchangeRateGraph
    tokenA={{
      type: "native",
      chainId: "dev.gnoswap",
      name: "Gnoland",
      path: "gnot",
      decimals: 6,
      symbol: "GNOT",
      logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/gnot.svg",
      priceID: "gnot",
      description: "Gno.land is a platform to write smart contracts in Gnolang (Gno). Using an interpreted version of the general-purpose programming language Golang (Go), developers can write smart contracts and other blockchain apps without having to learn a language that’s exclusive to a single ecosystem. Web2 developers can easily contribute to web3 and start building a more transparent, accountable world.\n\nThe Gno transaction token, GNOT, and the contributor memberships power the platform, which runs on a variation of Proof of Stake. Proof of Contribution rewards contributors from technical and non-technical backgrounds, fairly and for life with GNOT. This consensus mechanism also achieves higher security with fewer validators, optimizing resources for a greener, more sustainable, and enduring blockchain ecosystem.\n\nAny blockchain using Gnolang achieves succinctness, composability, expressivity, and completeness not found in any other smart contract platform. By observing a minimal structure, the design can endure over time and challenge the regime of information censorship we’re living in today.",
      wrappedPath: "gno.land/r/demo/wugnot",
      createdAt: ""
    }}
    tokenB={{
      chainId: "dev.gnoswap",
      decimals: 4,
      description: "GNS is a GRC20 token issued solely for testing purposes.",
      logoURI: "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_gns.svg",
      name: "Gnoswap",
      path: "gno.land/r/demo/gns",
      priceID: "gno.land/r/demo/gns",
      symbol: "GNS",
      type: "grc20",
      wrappedPath: "gno.land/r/demo/gns",
      createdAt: ""
    }}
    feeTier={""}
    data={exchangeRateGraphData}
  />);
};

export default ExchangeRateGraphContainer;