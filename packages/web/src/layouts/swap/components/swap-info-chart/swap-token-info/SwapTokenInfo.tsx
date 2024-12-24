import React from "react";

import { TokenModel } from "@models/token/token-model";

import { SwapTokenInfoWrapper } from "./SwapTokenInfo.styles";
import SwapTokenHeader from "./SwapTokenHeader";
import { useGetTokenDetails, useGetTokenPrices } from "@query/token";
import SwapTokenChart from "./SwapTokenChart";

interface SwapTokenInfoProps {
  token: TokenModel;
}

const SwapTokenInfo = ({ token }: SwapTokenInfoProps) => {
  const tokenData = React.useMemo(
    () => ({
      name: token.name,
      symbol: token.symbol,
      logoURI: token.logoURI,
      path: token.type === "native" ? token.wrappedPath : token.path,
      isNative: token.type === "native",
    }),
    [token],
  );

  const { data: { usd: currentPrice } = {} } = useGetTokenPrices(tokenData.path as string, {
    enabled: !!tokenData.path,
  });

  const { data: { prices7d = [] } = {}, isLoading } = useGetTokenDetails(tokenData.path as string, {
    enabled: !!tokenData.path,
  });

  return (
    <SwapTokenInfoWrapper>
      <SwapTokenHeader tokenInfo={tokenData} price={currentPrice} />
      <SwapTokenChart data={prices7d} isLoading={isLoading} />
    </SwapTokenInfoWrapper>
  );
};

export default SwapTokenInfo;
