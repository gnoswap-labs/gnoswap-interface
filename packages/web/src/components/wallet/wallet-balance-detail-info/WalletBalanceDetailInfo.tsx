import React, { useRef, useEffect, useState, useMemo } from "react";
import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import {
  WalletBalanceDetailInfoTooltipContent,
  WalletBalanceDetailInfoWrapper,
} from "./WalletBalanceDetailInfo.styles";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { useWindowSize } from "@hooks/common/use-window-size";
import { numberToFormat } from "@utils/string-utils";
import BigNumber from "bignumber.js";

interface WalletBalanceDetailInfoProps {
  title: string;
  value: string;
  tooltip?: string;
  button?: React.ReactNode;
  loading: boolean;
  className?: string;
}

const WalletBalanceDetailInfo: React.FC<WalletBalanceDetailInfoProps> = ({
  title,
  value,
  tooltip,
  button,
  loading,
  className,
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
          <span
            className="value"
            style={isClaim ? { fontSize: `${fontSize}px` } : {}}
          >
            {displayValue}
          </span>
        )}
        {button && <div className="button-wrapper">{button}</div>}
        {isClaim && (
          <span className="value hidden-value" ref={divRef}>
            {displayValue}
          </span>
        )}
      </div>
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
