import { cx } from "@emotion/css";
import dayjs from "dayjs";
import React from "react";
import { useTranslation } from "react-i18next";

import { GNOT_TOKEN } from "@common/values/token-constant";
import { LineGraphData } from "@components/common/line-graph/LineGraph";
import { useTheme } from "@emotion/react";
import useElementWidth from "@hooks/common/use-element-width";
import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";
import { useTokenPriceInfo } from "@hooks/token/data/use-token-price-info";
import { TOKEN_PRICE_GRADE_TYPE } from "@models/token/token-price-grade";
import { formatPrice } from "@utils/new-number-utils";

import IconOpenLink from "@components/common/icons/IconOpenLink";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import useCustomRouter from "@hooks/common/use-custom-router";
import { nullish } from "@utils/nullish-utils";
import { formatTokenPath } from "@utils/token-utils";
import { SwapTokenHeaderWrapper } from "./SwapTokenHeader.styles";

import PriceWarning from "@components/common/price-warning/PriceWarning";

interface TokenInfo {
  name: string;
  symbol: string;
  displaySymbol: string;
  logoURI: string;
  path: string | undefined;
  isNative: boolean;
}

interface SwapTokenHeaderProps {
  tokenInfo: TokenInfo;
  priceGradeType: TOKEN_PRICE_GRADE_TYPE;
  currentPrice: string | undefined;
  chartData?: LineGraphData;
  containerWidth: number;
}

const SwapTokenHeader = ({
  tokenInfo,
  priceGradeType,
  currentPrice,
  chartData,
  containerWidth,
}: SwapTokenHeaderProps) => {
  const router = useCustomRouter();
  const elementId = React.useMemo(() => `${tokenInfo.name}`, [tokenInfo.name]);

  const { priceStyle, shouldShowPriceWarning } = useTokenPriceInfo({ priceGradeType });

  const priceRef = React.useRef<HTMLDivElement>(null);
  const tokenNameRef = React.useRef<HTMLButtonElement>(null);

  const priceWidth = useElementWidth(priceRef, [tokenInfo]);
  const tokenNameWidth = useElementWidth(tokenNameRef, [tokenInfo]);

  const theme = useTheme();
  const { t } = useTranslation();

  const { getGnoscanUrl, getTokenUrl } = useGnoscanUrl();

  const displayPrice = React.useMemo(() => {
    const price = nullish.handleFalsy(chartData?.value, currentPrice);
    return `${formatPrice(price, { isKMB: false, lessThan1Significant: 2, forcedDecimals: true })}`;
  }, [chartData, currentPrice]);

  const displayDate = React.useMemo(() => {
    if (!chartData) return t("common:day.today");

    const timeFormat = "MMM D, HH:mm";
    const today = dayjs().format(timeFormat);
    const chartDate = dayjs(chartData.time).format(timeFormat);

    return chartDate === today ? t("common:day.today") : chartDate;
  }, [chartData, t]);

  const displayTokenPath = React.useMemo(() => {
    if (!tokenInfo.path) return null;
    return formatTokenPath(tokenInfo.path, tokenInfo.isNative);
  }, [tokenInfo.path, tokenInfo.isNative]);

  const onClickTokenName = React.useCallback(() => {
    if (!tokenInfo.path) return;
    if (tokenInfo.isNative) {
      router.movePageWithTokenPath("TOKEN", GNOT_TOKEN.path);
      return;
    }
    router.movePageWithTokenPath("TOKEN", tokenInfo.path);
  }, [router, tokenInfo]);

  const onClickPath = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      if (tokenInfo.isNative) {
        window.open(getGnoscanUrl(), "_blank", "noopener,noreferrer");
      } else {
        window.open(getTokenUrl(tokenInfo.path ?? ""), "_blank", "noopener,noreferrer");
      }
    },
    [getGnoscanUrl, getTokenUrl, tokenInfo],
  );

  return (
    <SwapTokenHeaderWrapper containerWidth={containerWidth} priceWidth={priceWidth} tokenNameWidth={tokenNameWidth}>
      <div className="left">
        <MissingLogo url={tokenInfo.logoURI} symbol={tokenInfo.symbol} width={32} />
        <div className="token-title">
          <div className="name">
            <button
              className="token-name"
              id={elementId}
              style={{ flexShrink: 0 }}
              ref={tokenNameRef}
              onClick={onClickTokenName}
            >
              {tokenInfo.name}
            </button>
            <button className="link" onClick={onClickPath}>
              <span>{displayTokenPath}</span>
              <IconOpenLink size="10px" fill={theme.color.text04} className="path-link-icon" />
            </button>
          </div>
          <div className="symbol">{tokenInfo.displaySymbol}</div>
        </div>
      </div>
      <div className="right">
        <div className="token-price">
          <div className={cx("price", priceStyle.className)} ref={priceRef}>
            {displayPrice}
            {shouldShowPriceWarning && <PriceWarning type="PRICE" />}
          </div>
          <div className="blank" />
          <div className="date">{displayDate}</div>
        </div>
      </div>
    </SwapTokenHeaderWrapper>
  );
};

export default SwapTokenHeader;
