import React from "react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import { formatPrice } from "@utils/new-number-utils";
import { useTheme } from "@emotion/react";
import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";
import { LineGraphData } from "@components/common/line-graph/LineGraph";
import { DEVICE_TYPE } from "@styles/media";
import useElementWidth from "@hooks/common/use-element-width";

import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { SwapTokenHeaderWrapper } from "./SwapTokenHeader.styles";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import { nullish } from "@utils/nullish-utils";
import { STATIC_TEXT } from "@common/values";
import useCustomRouter from "@hooks/common/use-custom-router";

interface TokenInfo {
  name: string;
  symbol: string;
  logoURI: string;
  path: string | undefined;
  isNative: boolean;
}

interface SwapTokenHeaderProps {
  breakpoint: DEVICE_TYPE;
  isMobile: boolean;
  tokenInfo: TokenInfo;
  currentPrice: string | undefined;
  chartData?: LineGraphData;
  width: number;
  containerWidth: number;
}

const SwapTokenHeader = ({ tokenInfo, currentPrice, chartData, containerWidth }: SwapTokenHeaderProps) => {
  const router = useCustomRouter();
  const elementId = React.useMemo(() => `${tokenInfo.name}`, [tokenInfo.name]);

  const priceRef = React.useRef<HTMLDivElement>(null);
  const tokenNameRef = React.useRef<HTMLDivElement>(null);

  const priceWidth = useElementWidth(priceRef, [tokenInfo]);
  const tokenNameWidth = useElementWidth(tokenNameRef, [tokenInfo]);

  const theme = useTheme();
  const { t } = useTranslation();

  const { getGnoscanUrl, getTokenUrl } = useGnoscanUrl();

  const displayPrice = React.useMemo(() => {
    const price = nullish.handleFalsy(chartData?.value, currentPrice);
    return `${formatPrice(price, { lessThan1Significant: 2 })}`;
  }, [chartData, currentPrice]);

  const displayDate = React.useMemo(() => {
    if (!chartData) return t("common:day.today");

    const timeFormat = "MMM D, HH:mm";
    const today = dayjs().format(timeFormat);
    const chartDate = dayjs(chartData.time).format(timeFormat);

    return chartDate === today ? t("common:day.today") : chartDate;
  }, [chartData, t]);

  const displayTokenPath = React.useMemo(() => {
    if (tokenInfo.isNative) {
      return STATIC_TEXT.NATIVE_COIN;
    }
    return tokenInfo.path;
  }, [tokenInfo]);

  const onClickTokenName = React.useCallback(() => {
    if (!tokenInfo.path) return;
    router.movePageWithTokenPath("TOKEN", tokenInfo.path);
  }, [tokenInfo.path, router]);

  const onClickPath = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      if (tokenInfo.isNative) {
        window.open(getGnoscanUrl(), "_blank", "noopener,noreferrer");
      } else {
        window.open(getTokenUrl(nullish.handleFalsy(tokenInfo.path, "")), "_blank", "noopener,noreferrer");
      }
    },
    [tokenInfo],
  );

  return (
    <SwapTokenHeaderWrapper containerWidth={containerWidth} priceWidth={priceWidth} tokenNameWidth={tokenNameWidth}>
      <div className="left">
        <MissingLogo url={tokenInfo.logoURI} symbol={tokenInfo.symbol} width={32} />
        <div className="token-title">
          <div className="name">
            <div
              className="token-name"
              id={elementId}
              style={{ flexShrink: 0 }}
              ref={tokenNameRef}
              onClick={onClickTokenName}
            >
              {tokenInfo.name}
            </div>
            <button className="link" onClick={onClickPath}>
              <span>{displayTokenPath}</span>
              <IconOpenLink size="10px" fill={theme.color.text04} className="path-link-icon" />
            </button>
          </div>
          <div className="symbol">{tokenInfo.symbol}</div>
        </div>
      </div>
      <div className="right">
        <div className="token-price">
          <div className="price" ref={priceRef}>
            {displayPrice}
          </div>
          <div className="blank" />
          <div className="date">{displayDate}</div>
        </div>
      </div>
    </SwapTokenHeaderWrapper>
  );
};

export default SwapTokenHeader;
