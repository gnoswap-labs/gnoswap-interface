import { cx } from "@emotion/css";
import BigNumber from "bignumber.js";
import React, { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { isAmount } from "@common/utils/data-check-util";
import IconWallet from "@components/common/icons/IconWallet";
import SelectPairButton from "@components/common/select-pair-button/SelectPairButton";
import { useTokenBalanceDisplay } from "@hooks/token/ui/use-token-balance-display";
import { TokenModel } from "@models/token/token-model";

const LEADING_ZERO_REGEX = /^0+(?=\d)|(\.\d*)$/g;

interface OrderSellInputProps {
  token: TokenModel | null;
  amount: string;
  amountUsd: string;
  balance: string;
  connectedWallet: boolean;
  changeToken: (token: TokenModel) => void;
  /** Called with what the user types; Max fills the field through `onClickMax` instead. */
  changeAmount: (value: string) => void;
  /**
   * Fills in the most the balance can sell. The form works it out rather than
   * the field, so that its order button waits on, and can retry, the same estimate.
   */
  onClickMax: () => void;
  /** True while Max is being worked out. */
  loadingMaxAmount: boolean;
  /** The whole balance, shown in place of the amount while Max is worked out. */
  pendingBalance: string | null;
  /** False while Max waits on order terms that are not settled yet (DCA on GNOT: the schedule). */
  maxAmountReady?: boolean;
  /** True when the amount is derived (Limit Buy funding): shown, but not typed into. Max and the token picker stay live. */
  readOnly?: boolean;
  showMaxButton?: boolean;
  className?: string;
  children?: React.ReactNode;
}

/** The sell section of an order form: amount, token, USD value, balance and Max. Same behaviour as the swap card. */
const OrderSellInput: React.FC<OrderSellInputProps> = ({
  token,
  amount,
  amountUsd,
  balance,
  connectedWallet,
  changeToken,
  changeAmount,
  onClickMax,
  loadingMaxAmount,
  pendingBalance,
  maxAmountReady = true,
  readOnly = false,
  showMaxButton = true,
  className = "first-section",
  children,
}) => {
  const { t } = useTranslation();
  const [focused, setFocused] = useState(false);
  const balanceDisplay = useTokenBalanceDisplay(balance, connectedWallet);

  const hasBalance = connectedWallet && balance !== "-" && BigNumber(balance.replace(/,/g, "")).isGreaterThan(0);

  const onChangeAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "") {
        changeAmount("");
        return;
      }
      if (!isAmount(value)) return;
      if (token && (value.split(".")[1]?.length ?? 0) > token.decimals) return;
      changeAmount(value.replace(LEADING_ZERO_REGEX, "$1"));
    },
    [changeAmount, token],
  );

  const displayAmount = useMemo(
    () => (amount.includes("e") ? BigNumber(amount).toFixed(token?.decimals ?? 0) : amount),
    [amount, token?.decimals],
  );

  return (
    <div className={cx(className, { "is-focused": !readOnly && focused })}>
      <div className="amount-container">
        <input
          className={cx("amount-text", { "amount-pending": !!pendingBalance })}
          value={pendingBalance ? "" : displayAmount}
          onChange={onChangeAmount}
          readOnly={readOnly}
          tabIndex={readOnly ? -1 : undefined}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={pendingBalance ?? "0"}
          autoComplete="off"
          spellCheck="false"
          inputMode="decimal"
        />
        <div className="token-selector">
          <SelectPairButton token={token} changeToken={changeToken} />
        </div>
      </div>
      <div className="amount-info">
        <span className="price-text">{amountUsd}</span>
        <div className="balance-wrapper">
          {connectedWallet && <IconWallet />}
          <span className="balance-text">{balanceDisplay}</span>
          {showMaxButton && hasBalance && (
            <button className="balance-max-button" onClick={onClickMax} disabled={loadingMaxAmount || !maxAmountReady}>
              <span className="max-badge">{t("common:max")}</span>
            </button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default OrderSellInput;
