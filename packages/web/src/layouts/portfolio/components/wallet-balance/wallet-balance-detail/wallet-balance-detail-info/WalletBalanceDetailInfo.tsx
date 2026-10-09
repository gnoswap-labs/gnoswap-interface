import BigNumber from "bignumber.js";
import React, { useEffect, useMemo, useRef, useState } from "react";

import IconInfo from "@components/common/icons/IconInfo";
import Tooltip from "@components/common/tooltip/Tooltip";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { useWindowSize } from "@hooks/common/use-window-size";
import { DEVICE_TYPE } from "@styles/media";

import {
  WalletBalanceDetailInfoTooltipContent,
  WalletBalanceDetailInfoWrapper,
} from "./WalletBalanceDetailInfo.styles";
import { formatOtherPrice } from "@utils/new-number-utils";

interface WalletBalanceDetailInfoProps {
  title: string;
  tooltip?: string;
  value: string;
  valueTooltip?: React.ReactNode;
  interactiveValueTooltip?: boolean;
  valueTooltipReady?: boolean;
  valueTooltipActive?: boolean;
  valueTooltipScope?: string;
  onValueTooltipInteractionChange?: (active: boolean) => void;
  button?: React.ReactNode;
  loading: boolean;
  className?: string;
  breakpoint: DEVICE_TYPE;
  connected: boolean;
  isSwitchNetwork: boolean;
  isClaimableAll?: boolean;
}

const WalletBalanceDetailInfo: React.FC<WalletBalanceDetailInfoProps> = ({
  title,
  tooltip,
  value,
  valueTooltip,
  interactiveValueTooltip = false,
  valueTooltipReady = true,
  valueTooltipActive,
  valueTooltipScope,
  onValueTooltipInteractionChange,
  button,
  loading,
  className,
  breakpoint,
}) => {
  const divRef = useRef<HTMLDivElement | null>(null);
  const valueRef = useRef<HTMLDivElement | null>(null);
  const [fontSize, setFontSize] = useState(24);
  const { width } = useWindowSize();
  const hovered = useRef(false);
  const focused = useRef(false);
  // Only an already shown tooltip may rely on safePolygon after leaving its amount.
  const [openTooltipScope, setOpenTooltipScope] = useState<string | null>(null);
  const valueTooltipOpen = openTooltipScope === (valueTooltipScope ?? "") && valueTooltipReady;

  useEffect(() => {
    const divElement = divRef.current;
    const valueElement = valueRef.current;
    const size = width > 1180 ? 28 : 24;
    if (divElement && valueElement) {
      setFontSize(Math.min(((valueElement.offsetWidth - 70) * size) / divElement.offsetWidth, size));
    }
  }, [valueRef, divRef, width]);
  const isClaim = className === "claimable-rewards" && width > 968;

  const displayValue = useMemo(() => {
    if (value === "-") return "-";
    if (!value || BigNumber(value).isZero()) {
      return "$0";
    }
    if (BigNumber(value).isLessThan(0.01)) {
      return "<$0.01";
    }
    return formatOtherPrice(value, { isKMB: false });
  }, [value]);

  return (
    <WalletBalanceDetailInfoWrapper className={className}>
      <div className="wallet-detail-left-side">
        <div className="title-wrapper">
          <span className="title">{title}</span>
          {tooltip !== undefined && <WalletBalanceDetailInfoTooltip tooltip={tooltip} />}
        </div>
        <div className="value-wrapper" ref={valueRef}>
          {loading ? (
            <div className="value loading">
              <span css={pulseSkeletonStyle({ h: 20, w: "120px" })} />
            </div>
          ) : (
            <Tooltip
              placement="top"
              forcedClose={!valueTooltip || !valueTooltipReady || (valueTooltipActive === false && !valueTooltipOpen)}
              onChangeOpen={open => setOpenTooltipScope(open ? valueTooltipScope ?? "" : null)}
              FloatingContent={valueTooltip}
              scroll={!interactiveValueTooltip}
              interactive={interactiveValueTooltip}
            >
              <span
                className={`value ${valueTooltip ? "has-tooltip" : ""}`}
                tabIndex={interactiveValueTooltip && valueTooltip ? 0 : undefined}
                onMouseEnter={() => {
                  hovered.current = true;
                  onValueTooltipInteractionChange?.(true);
                }}
                onMouseLeave={() => {
                  hovered.current = false;
                  onValueTooltipInteractionChange?.(focused.current);
                }}
                onFocus={() => {
                  focused.current = true;
                  onValueTooltipInteractionChange?.(true);
                }}
                onBlur={() => {
                  focused.current = false;
                  onValueTooltipInteractionChange?.(hovered.current);
                }}
                style={isClaim ? { fontSize: `${fontSize}px` } : {}}
              >
                {displayValue}
              </span>
            </Tooltip>
          )}
          {breakpoint !== DEVICE_TYPE.MOBILE && button && <div className="button-wrapper">{button}</div>}
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

export const WalletBalanceDetailInfoTooltip: React.FC<{ tooltip: string }> = ({ tooltip }) => {
  const TooltipFloatingContent = (
    <WalletBalanceDetailInfoTooltipContent>{tooltip}</WalletBalanceDetailInfoTooltipContent>
  );

  return (
    <Tooltip placement="top" FloatingContent={TooltipFloatingContent}>
      <IconInfo />
    </Tooltip>
  );
};

export default WalletBalanceDetailInfo;
