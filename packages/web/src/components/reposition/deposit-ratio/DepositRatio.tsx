import IconInfo from "@components/common/icons/IconInfo";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import Tooltip from "@components/common/tooltip/Tooltip";
import { RANGE_STATUS_OPTION } from "@constants/option.constant";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { useWindowSize } from "@hooks/common/use-window-size";
import { IPriceRange } from "@hooks/increase/use-increase-handle";
import { SelectPool } from "@hooks/pool/use-select-pool";
import { TokenModel } from "@models/token/token-model";
import { DEVICE_TYPE } from "@styles/media";
import { formatRate } from "@utils/new-number-utils";
import React, { useMemo } from "react";
import {
  DepositRatioWrapper,
  ToolTipContentWrapper,
} from "./DepositRatio.styles";

export interface DepositRatioProps {
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  fee: string;
  rangeStatus: RANGE_STATUS_OPTION;
  aprFee: number;
  priceRangeSummary: IPriceRange;
  isLoadingPosition: boolean;
  selectPool: SelectPool;
}

const DepositRatio: React.FC<DepositRatioProps> = ({
  tokenA,
  tokenB,
  aprFee,
  priceRangeSummary,
  isLoadingPosition,
  selectPool,
}) => {
  const { breakpoint } = useWindowSize();
  const isMobile = breakpoint === DEVICE_TYPE.MOBILE;

  const isLoading = useMemo(
    () => isLoadingPosition || selectPool.isLoading,
    [isLoadingPosition, selectPool.isLoading],
  );

  const loadingComp = useMemo(
    () => (
      <div
        css={pulseSkeletonStyle({
          w: 100,
        })}
      />
    ),
    [],
  );

  const depositRatioDisplay = useMemo(() => {
    if (isLoading) return loadingComp;

    return (
      <>
        {priceRangeSummary.tokenARatioStr}
        {"% "}
        {isMobile ? (
          <MissingLogo
            symbol={tokenA?.symbol || ""}
            url={tokenA?.logoURI}
            className="token-logo"
            width={18}
          />
        ) : (
          `${tokenA?.symbol}`
        )}{" "}
        / {priceRangeSummary.tokenBRatioStr}
        {"% "}
        {isMobile ? (
          <MissingLogo
            symbol={tokenB?.symbol || ""}
            url={tokenB?.logoURI}
            className="token-logo"
            width={18}
          />
        ) : (
          `${tokenB?.symbol}`
        )}
      </>
    );
  }, [
    isMobile,
    loadingComp,
    priceRangeSummary.tokenARatioStr,
    priceRangeSummary.tokenBRatioStr,
    tokenA?.logoURI,
    tokenA?.symbol,
    tokenB?.logoURI,
    tokenB?.symbol,
    isLoading,
  ]);

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
          <p className="value">{depositRatioDisplay}</p>
        </div>
        <div>
          <div>
            <p className="label">Capital Efficiency</p>
            <Tooltip
              placement="top"
              FloatingContent={
                <ToolTipContentWrapper>
                  The multiplier calculated based on the concentration of your
                  range. This indicates how much more rewards you can earn
                  compared to a full range position with the same capital.
                </ToolTipContentWrapper>
              }
            >
              <IconInfo />
            </Tooltip>
          </div>
          <p className="value">
            {isLoading ? loadingComp : priceRangeSummary.feeBoost}
          </p>
        </div>
        <div>
          <div>
            <p className="label">Fee APR</p>
            <Tooltip
              placement="top"
              FloatingContent={
                <ToolTipContentWrapper>
                  The estimated APR from swap fees is calculated based on the
                  selected price range of the position.
                </ToolTipContentWrapper>
              }
            >
              <IconInfo />
            </Tooltip>
          </div>
          <p className="value">
            {isLoading ? loadingComp : formatRate(aprFee)}
          </p>
        </div>
      </div>
    </DepositRatioWrapper>
  );
};

export default DepositRatio;
