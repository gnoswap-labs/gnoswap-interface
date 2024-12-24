import React from "react";
import { formatPrice } from "@utils/new-number-utils";

import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { SwapTokenHeaderWrapper } from "./SwapTokenHeader.styles";
import IconOpenLink from "@components/common/icons/IconOpenLink";

interface TokenInfo {
  name: string;
  symbol: string;
  logoURI: string;
  path: string | undefined;
  isNative: boolean;
}

interface SwapTokenHeaderProps {
  tokenInfo: TokenInfo;
  price: string | undefined;
}

const SwapTokenHeader = ({ tokenInfo, price }: SwapTokenHeaderProps) => {
  const displayPrice = React.useMemo(() => {
    return `${formatPrice(price, { lessThan1Significant: 2 })}`;
  }, [price]);

  return (
    <SwapTokenHeaderWrapper>
      <div className="left">
        <MissingLogo url={tokenInfo.logoURI} symbol={tokenInfo.symbol} width={24} />
        <div className="token-title">
          <div className="name">
            <div>{tokenInfo.name}</div>
            <button className="link">
              <span>{tokenInfo.path}</span> <IconOpenLink />
            </button>
          </div>
          <div className="symbol">{tokenInfo.symbol}</div>
        </div>
      </div>
      <div className="right">
        <div className="token-price">
          <div className="price">{displayPrice}</div>
          <div className="date">Today</div>
        </div>
      </div>
    </SwapTokenHeaderWrapper>
  );
};

export default SwapTokenHeader;
