import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { TokenModel } from "@models/token/token-model";
import React, { useMemo } from "react";
import { BalanceChangeWrapper } from "./BalanceChange.styles";
import { useWindowSize } from "@hooks/common/use-window-size";
import { DEVICE_TYPE } from "@styles/media";
import { numberToFormat } from "@utils/string-utils";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";

export interface BalanceChangeProps {
  tokenA: TokenModel;
  tokenB: TokenModel;
  title?: string;
  isHiddenCurrentBalance?: boolean;
  currentAmounts: { amountA: number; amountB: number } | null;
  repositionAmounts: { amountA: number | null; amountB: number | null } | null;
}

const BalanceChange: React.FC<BalanceChangeProps> = ({
  tokenA,
  tokenB,
  title = "3. Balance Changes",
  isHiddenCurrentBalance = true,
  currentAmounts,
  repositionAmounts,
}) => {
  const { breakpoint } = useWindowSize();
  const isMobile = breakpoint === DEVICE_TYPE.MOBILE;

  const currentTokenAAmount = useMemo(() => {
    if (!currentAmounts) {
      return "-";
    }
    return numberToFormat(currentAmounts.amountA, {
      decimals: 2,
      forceDecimals: true,
    });
  }, [currentAmounts]);

  const currentTokenBAmount = useMemo(() => {
    if (!currentAmounts) {
      return "-";
    }
    return numberToFormat(currentAmounts.amountB, {
      decimals: 2,
      forceDecimals: true,
    });
  }, [currentAmounts]);

  const repositionTokenAAmount = useMemo(() => {
    if (!repositionAmounts) {
      return "-";
    }

    if (repositionAmounts.amountA === null) {
      return null;
    }

    return numberToFormat(repositionAmounts.amountA, {
      decimals: 2,
      forceDecimals: true,
    });
  }, [repositionAmounts]);

  const repositionTokenBAmount = useMemo(() => {
    if (!repositionAmounts) {
      return "-";
    }

    if (repositionAmounts.amountB === null) {
      return null;
    }

    return numberToFormat(repositionAmounts.amountB, {
      decimals: 2,
      forceDecimals: true,
    });
  }, [repositionAmounts]);

  return (
    <BalanceChangeWrapper>
      <h5>{title}</h5>
      {isMobile && !isHiddenCurrentBalance && (
        <div className="select-position common-bg">
          <div className="table-balance-change">
            <p className="label">Token</p>
            <p className="label">Current Balance</p>
            <p className="label">Current Balance</p>
          </div>

          <div className="table-balance-change">
            <p className="value">
              <MissingLogo
                symbol={tokenA?.symbol}
                url={tokenA?.logoURI}
                width={24}
              />{" "}
              {tokenA?.symbol}
            </p>
            <p className="label">{currentTokenAAmount}</p>
            <p className="label">{currentTokenAAmount}</p>
          </div>
          <div className="table-balance-change">
            <p className="value">
              <MissingLogo
                symbol={tokenB?.symbol}
                url={tokenB?.logoURI}
                width={24}
              />{" "}
              {tokenB?.symbol}
            </p>
            <p className="label">{currentTokenBAmount}</p>
            <p className="label">{currentTokenBAmount}</p>
          </div>
        </div>
      )}
      <div className="select-position common-bg">
        <div className="table-balance-change">
          <p className="label">Token</p>
          <p className="label">Current Balance</p>
          <p className="label">New Balance</p>
        </div>

        <div className="table-balance-change">
          <p className="value">
            <MissingLogo
              symbol={tokenA?.symbol}
              url={tokenA?.logoURI}
              width={24}
            />{" "}
            {tokenA?.symbol}
          </p>
          <p className="label">{currentTokenAAmount}</p>
          <p className="label new-balance">
            {repositionTokenAAmount !== null ? (
              repositionTokenAAmount
            ) : (
              <div
                css={pulseSkeletonStyle({ w: 80, h: 18 })}
                className="loading-skeleton"
              />
            )}
          </p>
        </div>
        <div className="table-balance-change">
          <p className="value">
            <MissingLogo
              symbol={tokenB?.symbol}
              url={tokenB?.logoURI}
              width={24}
            />{" "}
            {tokenB?.symbol}
          </p>
          <p className="label">{currentTokenBAmount}</p>
          <p className="label new-balance">
            {repositionTokenBAmount !== null ? (
              repositionTokenBAmount
            ) : (
              <div
                css={pulseSkeletonStyle({ w: 80, h: 18 })}
                className="loading-skeleton"
              />
            )}
          </p>
        </div>
      </div>
    </BalanceChangeWrapper>
  );
};

export default BalanceChange;
