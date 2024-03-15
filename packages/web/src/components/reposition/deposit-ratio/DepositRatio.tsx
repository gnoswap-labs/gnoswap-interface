import IconInfo from "@components/common/icons/IconInfo";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import Tooltip from "@components/common/tooltip/Tooltip";
import { RANGE_STATUS_OPTION } from "@constants/option.constant";
import { useWindowSize } from "@hooks/common/use-window-size";
import { IPriceRange } from "@hooks/increase/use-increase-handle";
import { TokenModel } from "@models/token/token-model";
import { DEVICE_TYPE } from "@styles/media";
import React from "react";
import {
  DepositRatioWrapper,
  ToolTipContentWrapper,
} from "./DepositRatio.styles";

export interface DepositRatioProps {
  tokenA: TokenModel;
  tokenB: TokenModel;
  fee: string;
  maxPriceStr: string;
  minPriceStr: string;
  rangeStatus: RANGE_STATUS_OPTION;
  aprFee: number;
  priceRangeSummary: IPriceRange;
}

const DepositRatio: React.FC<DepositRatioProps> = ({
  tokenA,
  tokenB,
  aprFee,
  priceRangeSummary,
}) => {
  const { breakpoint } = useWindowSize();
  const isMobile = breakpoint === DEVICE_TYPE.MOBILE;
  return (
    <DepositRatioWrapper>
      <div className="deposit-ratio common-bg">
        <div>
          <div>
            <p className="label">Deposit Ratio</p>
            <Tooltip
              placement="top"
              FloatingContent={
                <ToolTipContentWrapper>
                  The deposit ratio of the two tokens is determined based on the
                  current price and the set price range.
                </ToolTipContentWrapper>
              }
            >
              <IconInfo />
            </Tooltip>
          </div>
          <p className="value">
            {priceRangeSummary.tokenARatioStr}{" "}
            {isMobile ? (
              <MissingLogo
                symbol={tokenA?.symbol}
                url={tokenA?.logoURI}
                className="token-logo"
                width={18}
              />
            ) : (
              `${tokenA?.symbol}`
            )}{" "}
            / {priceRangeSummary.tokenBRatioStr}{" "}
            {isMobile ? (
              <MissingLogo
                symbol={tokenB?.symbol}
                url={tokenB?.logoURI}
                className="token-logo"
                width={18}
              />
            ) : (
              `${tokenB?.symbol}`
            )}
          </p>
        </div>
        <div>
          <div>
            <p className="label">Capital Efficiency</p>
            <Tooltip
              placement="top"
              FloatingContent={
                <ToolTipContentWrapper>
                  The deposit ratio of the two tokens is determined based on the
                  current price and the set price range.
                </ToolTipContentWrapper>
              }
            >
              <IconInfo />
            </Tooltip>
          </div>
          <p className="value">{priceRangeSummary.feeBoost}</p>
        </div>
        <div>
          <div>
            <p className="label">Fee APR</p>
            <Tooltip
              placement="top"
              FloatingContent={
                <ToolTipContentWrapper>
                  The deposit ratio of the two tokens is determined based on the
                  current price and the set price range.
                </ToolTipContentWrapper>
              }
            >
              <IconInfo />
            </Tooltip>
          </div>
          <p className="value">{aprFee}%</p>
        </div>
      </div>
    </DepositRatioWrapper>
  );
};

export default DepositRatio;
