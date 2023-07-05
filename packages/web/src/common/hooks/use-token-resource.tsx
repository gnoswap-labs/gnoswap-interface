import { TokenAtom } from "@atoms/index";
import { useAtom } from "jotai";
import { useGnoswapContext } from "./use-gnoswap-context";

const EXAMPLE_LOGO =
  "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png";

export const useTokenResource = () => {
  const { tokenRepository } = useGnoswapContext();

  const [tokenMetas, setTokenMetas] = useAtom(TokenAtom.tokenMetas);

  const getMetaInfo = (tokenId: string) => {
    return tokenMetas.find(token => token.token_id === tokenId);
  };

  const getLogo = (tokenId: string) => {
    const metaInfo = getMetaInfo(tokenId);
    if (metaInfo) {
      return EXAMPLE_LOGO;
    }
    return EXAMPLE_LOGO;
  };

  const updateTokenMetas = () => {
    tokenRepository
      .getAllTokenMetas()
      .then(resposne => setTokenMetas(resposne.tokens));
  };

  return {
    getMetaInfo,
    getLogo,
    updateTokenMetas,
  };
};
