import React from "react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import { formatPrice } from "@utils/new-number-utils";
import { useTheme } from "@emotion/react";
import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";
import { STATIC_TEXT } from "@common/values";
import { LineGraphData } from "@components/common/line-graph/LineGraph";

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
  currentPrice: string | undefined;
  chartData?: LineGraphData;
}

const SwapTokenHeader = ({ tokenInfo, currentPrice, chartData }: SwapTokenHeaderProps) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const { getGnoscanUrl, getTokenUrl } = useGnoscanUrl();

  const displayPath = React.useMemo(() => {
    if (tokenInfo.isNative) {
      return STATIC_TEXT.NATIVE_COIN;
    } else {
      return tokenInfo.path;
    }
  }, [tokenInfo]);

  const displayPrice = React.useMemo(() => {
    const price = chartData?.value || currentPrice;
    return `${formatPrice(price, { lessThan1Significant: 2 })}`;
  }, [chartData, currentPrice]);

  const displayDate = React.useMemo(() => {
    if (!chartData) return t("common:day.today");

    const timeFormat = "MMM DD";
    const today = dayjs().format(timeFormat);
    const chartDate = dayjs(chartData.time).format(timeFormat);

    return chartDate === today ? t("common:day.today") : chartDate;
  }, [chartData, t]);

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
          <div className="date">{displayDate}</div>
        </div>
      </div>
    </SwapTokenHeaderWrapper>
  );
};

export default SwapTokenHeader;
