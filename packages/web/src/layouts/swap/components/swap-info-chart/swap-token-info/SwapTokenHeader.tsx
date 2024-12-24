import React from "react";
import dayjs from "dayjs";

import { formatPrice } from "@utils/new-number-utils";
import { useTheme } from "@emotion/react";
import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";
import { STATIC_TEXT } from "@common/values";

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
  const [isHovered, setIsHovered] = React.useState(false);

  const theme = useTheme();

  const { getGnoscanUrl, getTokenUrl } = useGnoscanUrl();

  const displayPath = React.useMemo(() => {
    if (tokenInfo.isNative) {
      return STATIC_TEXT.NATIVE_COIN;
    } else {
      return tokenInfo.path;
    }
  }, [tokenInfo]);

  const displayPrice = React.useMemo(() => {
    return `${formatPrice(price, { lessThan1Significant: 2 })}`;
  }, [price]);

  const displayDate = React.useMemo(() => {
    return isHovered ? dayjs().format("MMM DD") : "Today";
  }, [isHovered]);

  const onClickPath = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      if (tokenInfo.isNative) {
        window.open(getGnoscanUrl(), "_blank", "noopener,noreferrer");
      } else {
        window.open(getTokenUrl(tokenInfo.path || ""), "_blank", "noopener,noreferrer");
      }
    },
    [tokenInfo],
  );

  return (
    <SwapTokenHeaderWrapper>
      <div className="left">
        <MissingLogo url={tokenInfo.logoURI} symbol={tokenInfo.symbol} width={24} />
        <div className="token-title">
          <div className="name">
            <div>{tokenInfo.name}</div>
            <button className="link" onClick={onClickPath}>
              <span>{displayPath}</span> <IconOpenLink fill={theme.color.text04} className="path-link-icon" />
            </button>
          </div>
          <div className="symbol">{tokenInfo.symbol}</div>
        </div>
      </div>
      <div className="right">
        <div className="token-price">
          <div className="price">{displayPrice}</div>
          <div className="date" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            {displayDate}
          </div>
        </div>
      </div>
    </SwapTokenHeaderWrapper>
  );
};

export default SwapTokenHeader;
