import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import { useWindowSize } from "@hooks/common/use-window-size";
import { SelectPool } from "@hooks/pool/use-select-pool";
import { TokenModel } from "@models/token/token-model";
import { DEVICE_TYPE } from "@styles/media";
import { numberToFormat } from "@utils/string-utils";

import { BalanceChangeWrapper } from "./BalanceChange.styles";

export interface BalanceChangeProps {
  tokenA: TokenModel | null;
  tokenB: TokenModel | null;
  title?: string;
  isHiddenCurrentBalance?: boolean;
  currentAmounts: { amountA: string; amountB: string } | null;
  repositionAmounts: { amountA: string | null; amountB: string | null } | null;
  selectPool?: SelectPool;
  isLoadingPosition: boolean;
}

const BalanceChange: React.FC<BalanceChangeProps> = ({
  tokenA,
  tokenB,
  title,
  isHiddenCurrentBalance = true,
  currentAmounts,
  repositionAmounts,
  selectPool,
  isLoadingPosition,
}) => {
  const { t } = useTranslation();
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

  const isLoading = useMemo(
    () => isLoadingPosition || selectPool?.isLoading,
    [isLoadingPosition, selectPool?.isLoading],
  );

  const withLoading = useCallback(
    (element: string, width?: number) => {
      return isLoading ? (
        <div
          css={pulseSkeletonStyle({
            w: width || 100,
          })}
        />
      ) : (
        element
      );
    },
    [isLoading],
  );

  return (
    <BalanceChangeWrapper>
      <h5>{title || t("common:balanceChange.defaultTitle")}</h5>
      {isMobile && !isHiddenCurrentBalance && (
        <div className="select-position common-bg">
          <div className="table-balance-change">
            <p className="label">{t("business:token")}</p>
            <p className="label">{t("common:balanceChange.currentBalance")}</p>
          </div>

          <div className="table-balance-change">
            <p className="value">
              <MissingLogo
                symbol={tokenA?.symbol || ""}
                url={tokenA?.logoURI}
                width={24}
              />{" "}
              {tokenA?.symbol}
            </p>
            <p className="value right dimmed">
              {withLoading(currentTokenAAmount)}
            </p>
          </div>
          <div className="table-balance-change">
            <p className="value">
              <MissingLogo
                symbol={tokenB?.symbol || ""}
                url={tokenB?.logoURI}
                width={24}
              />{" "}
              {tokenB?.symbol}
            </p>
            <p className="value right dimmed">
              {withLoading(currentTokenBAmount)}
            </p>
          </div>
        </div>
      )}
      <div className="select-position common-bg">
        <div className="table-balance-change">
          <p className="label">{t("business:token")}</p>
          {!isMobile && (
            <p className="label">{t("common:balanceChange.currentBalance")}</p>
          )}
          <p className="label">{t("common:balanceChange.newBalance")}</p>
        </div>

        <div className="table-balance-change">
          <p className="value">
            <MissingLogo
              symbol={tokenA?.symbol || ""}
              url={tokenA?.logoURI}
              width={24}
            />{" "}
            {tokenA?.symbol}
          </p>
          {!isMobile && (
            <p className="value right dimmed">
              {withLoading(currentTokenAAmount)}
            </p>
          )}
          <p className="value right">
            {withLoading(repositionTokenAAmount ?? "-")}
          </p>
        </div>
        <div className="table-balance-change">
          <p className="value">
            <MissingLogo
              symbol={tokenB?.symbol || ""}
              url={tokenB?.logoURI}
              width={24}
            />{" "}
            {tokenB?.symbol}
          </p>
          {!isMobile && (
            <p className="value right dimmed">
              {withLoading(currentTokenBAmount)}
            </p>
          )}
          <p className="value right">
            {withLoading(repositionTokenBAmount ?? "-")}
          </p>
        </div>
      </div>
    </BalanceChangeWrapper>
  );
};

export default BalanceChange;
