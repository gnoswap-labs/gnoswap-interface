import BigNumber from "bignumber.js";
import React, { useEffect, useMemo, useRef, useState } from "react";

import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { useWindowSize } from "@hooks/common/use-window-size";
import { DEVICE_TYPE } from "@styles/media";
import { numberToFormat } from "@utils/string-utils";

import {
  WalletBalanceDetailInfoTooltipContent,
  WalletBalanceDetailInfoWrapper
} from "./WalletBalanceDetailInfo.styles";

interface WalletBalanceDetailInfoProps {
  title: string;
  tooltip?: string;
  value: string;
  valueTooltip?: React.ReactNode;
  button?: React.ReactNode;
  loading: boolean;
  className?: string;
  breakpoint: DEVICE_TYPE;
}

const WalletBalanceDetailInfo: React.FC<WalletBalanceDetailInfoProps> = ({
  title,
  tooltip,
  value,
  valueTooltip,
  button,
  loading,
  className,
  breakpoint,
}) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const valueRef = useRef<HTMLDivElement | null>(null);
  const [fontSize, setFontSize] = useState(24);
  const { width } = useWindowSize();

  useEffect(() => {
    const divElement = divRef.current;
    const valueElement = valueRef.current;
    const size = width > 1180 ? 28 : 24;
    if (divElement && valueElement) {
      setFontSize(
        Math.min(
          ((valueElement.offsetWidth - 70) * size) / divElement.offsetWidth,
          size,
        ),
      );
    }
  }, [valueRef, divRef, width]);
  const isClaim = className === "claimable-rewards" && width > 968;

  const displayValue = useMemo(() => {
    if (!value || BigNumber(value).isZero()) {
      return "$0";
    }
    if (BigNumber(value).isLessThan(0.01)) {
      return "<$0.01";
    }
    return `$${numberToFormat(value, { decimals: 2, forceDecimals: true })}`;
  }, [value]);

  return (
    <WalletBalanceDetailInfoWrapper className={className}>
      <div className="wallet-detail-left-side">
        <div className="title-wrapper">
          <span className="title">{title}</span>
          {tooltip !== undefined && (
            <WalletBalanceDetailInfoTooltip tooltip={tooltip} />
          )}
        </div>
        <div className="value-wrapper" ref={valueRef}>
          {loading ? (
            <div className="value loading">
              <span css={pulseSkeletonStyle({ h: 20, w: "120px" })} />
            </div>
          ) : (
            <Tooltip
              placement="top"
              forcedClose={!valueTooltip}
              FloatingContent={valueTooltip}
              scroll
            >
              <span
                className={`value ${valueTooltip ? "has-tooltip" : ""}`}
                style={isClaim ? { fontSize: `${fontSize}px` } : {}}
              >
                {displayValue}
              </span>
            </Tooltip>
          )}
          {breakpoint !== DEVICE_TYPE.MOBILE && button && (
            <div className="button-wrapper">{button}</div>
          )}
          {isClaim && (
            <span className="value hidden-value" ref={divRef}>
              {displayValue}
            </span>
          )}
        </div>
      </div>
      {breakpoint === DEVICE_TYPE.MOBILE && button && (
        <div className="wallet-detail-right-side">
          <div className="button-wrapper">{button}</div>
        </div>
      )}
    </WalletBalanceDetailInfoWrapper>
  );
};

export const WalletBalanceDetailInfoTooltip: React.FC<{ tooltip: string }> = ({
  tooltip,
}) => {
  const TooltipFloatingContent = (
    <WalletBalanceDetailInfoTooltipContent>
      {tooltip}
    </WalletBalanceDetailInfoTooltipContent>
  );

  return (
    <Tooltip placement="top" FloatingContent={TooltipFloatingContent}>
      <IconInfo />
    </Tooltip>
  );
};

export default WalletBalanceDetailInfo;
