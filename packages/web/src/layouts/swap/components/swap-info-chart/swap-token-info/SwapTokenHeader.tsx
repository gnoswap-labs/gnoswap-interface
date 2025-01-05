import React from "react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

import { formatPrice } from "@utils/new-number-utils";
import { useTheme } from "@emotion/react";
import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";
import { STATIC_TEXT } from "@common/values";
import { LineGraphData } from "@components/common/line-graph/LineGraph";
import { DEVICE_TYPE } from "@styles/media";

import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { SwapTokenHeaderWrapper } from "./SwapTokenHeader.styles";
import IconOpenLink from "@components/common/icons/IconOpenLink";
import { nullish } from "@utils/nullish-utils";

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
}

const DETERMIN_SHORT_SIZE_WEB = 140;
const DETERMIN_SHORT_SIZE_TABLET = 200;
const DETERMIN_SHORT_SIZE_MOBILE = 90;

const MOBILE_CLIENT_SIZE_WIDTH = 414;

const SwapTokenHeader = ({ breakpoint, tokenInfo, currentPrice, chartData, width }: SwapTokenHeaderProps) => {
  const elementId = React.useMemo(() => `${tokenInfo.name}`, [tokenInfo.name]);
  const [shortenPath, setShortenPath] = React.useState(false);

  const theme = useTheme();
  const { t } = useTranslation();

  const { getGnoscanUrl, getTokenUrl } = useGnoscanUrl();

  React.useEffect(() => {
    const element = document.getElementById(elementId);

    if ((element?.clientWidth || 0) > DETERMIN_SHORT_SIZE_MOBILE && width < MOBILE_CLIENT_SIZE_WIDTH) {
      setShortenPath(true);
      return;
    }

    if (
      (element?.clientWidth || 0) > DETERMIN_SHORT_SIZE_TABLET &&
      (breakpoint === DEVICE_TYPE.TABLET || breakpoint === DEVICE_TYPE.TABLET_M || breakpoint === DEVICE_TYPE.TABLET_S)
    ) {
      setShortenPath(true);
      return;
    }

    if ((element?.clientWidth || 0) > DETERMIN_SHORT_SIZE_WEB) {
      setShortenPath(true);
      return;
    }

    setShortenPath(false);
  }, [elementId, breakpoint, width]);

  const displayPrice = React.useMemo(() => {
    const price = nullish.handleFalsy(chartData?.value, currentPrice);
    return `${formatPrice(price, { lessThan1Significant: 2 })}`;
  }, [chartData, currentPrice]);

  const displayDate = React.useMemo(() => {
    if (!chartData) return t("common:day.today");

    const timeFormat = "MMM DD, HH:mm";
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
        window.open(getTokenUrl(nullish.handleFalsy(tokenInfo.path, "")), "_blank", "noopener,noreferrer");
      }
    },
    [tokenInfo],
  );

  const length = React.useMemo(() => {
    return breakpoint === DEVICE_TYPE.MOBILE ? 10 : 15;
  }, [breakpoint]);

  const tokenPathDisplay = React.useMemo(() => {
    if (shortenPath) {
      return "";
    }
    if (tokenInfo.isNative) {
      return STATIC_TEXT.NATIVE_COIN;
    }
    if (!tokenInfo.path) return "";

    let replacedPath = tokenInfo.path?.replace("gno.land", "");

    if (replacedPath?.length > length) {
      replacedPath = replacedPath;
    }

    return "...".concat(replacedPath);
  }, [tokenInfo, length, shortenPath]);

  return (
    <SwapTokenHeaderWrapper>
      <div className="left">
        <MissingLogo url={tokenInfo.logoURI} symbol={tokenInfo.symbol} width={32} />
        <div className="token-title">
          <div className="name">
            <div id={elementId} style={{ flexShrink: 0 }}>
              {tokenInfo.name}
            </div>
            <button className="link" onClick={onClickPath}>
              <span>{tokenPathDisplay}</span>
              <IconOpenLink size="10px" fill={theme.color.text04} className="path-link-icon" />
            </button>
          </div>
          <div className="symbol">{tokenInfo.symbol}</div>
        </div>
      </div>
      <div className="right">
        <div className="token-price">
          <div className="price">{displayPrice}</div>
          <div className="blank" />
          <div className="date">{displayDate}</div>
        </div>
      </div>
    </SwapTokenHeaderWrapper>
  );
};

export default SwapTokenHeader;
