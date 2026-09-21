import React, { useCallback, useMemo } from "react";
import { TokenAmountInputWrapper } from "./TokenAmountInput.styles";
import { TokenAmountInputModel } from "@hooks/token/data/use-token-amount-input";
import { TokenModel } from "@models/token/token-model";
import { isAmount } from "@common/utils/data-check-util";
import SelectPairIncentivizeButton from "../select-pair-button/SelectPairIncentivizeButton";
import BigNumber from "bignumber.js";
import { MaxNativeAmountParams, useMaxNativeAmount } from "@hooks/gas";
import { useTranslation } from "react-i18next";
import IconWallet from "../icons/IconWallet";
import { useTokenBalanceDisplay } from "@hooks/token/ui/use-token-balance-display";

export interface TokenAmountInputProps extends TokenAmountInputModel {
  changable?: boolean;
  changeToken: (token: TokenModel) => void;
  connected: boolean;
  style?: React.CSSProperties;
  isVisibleMaxButton?: boolean;
  integersOnly?: boolean;
  poolTokens?: readonly TokenModel[];
  /**
   * Lets a GNOT MAX reserve the action's own gas fee and storage deposit from a
   * simulation instead of a flat estimate. See {@link useMaxNativeAmount}.
   */
  makeMaxAmountMessages?: MaxNativeAmountParams["makeMessages"];
}

const TokenAmountInput: React.FC<TokenAmountInputProps> = ({
  changable,
  token,
  balance,
  usdValue,
  changeAmount,
  changeToken,
  connected,
  amount,
  style,
  isVisibleMaxButton = true,
  integersOnly = false,
  poolTokens,
  makeMaxAmountMessages,
}) => {
  const { t } = useTranslation();
  const { getMaxAmount, loading: loadingMaxAmount } = useMaxNativeAmount();

  const balanceADisplay = useTokenBalanceDisplay(balance, connected);

  const disabledSelectPair = useMemo(() => {
    return changable !== true;
  }, [changable]);

  const digitRegex = useMemo(() => /^0+(?=\d)|(\.\d*)$/g, []);

  const onChangeAmountInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;

      if (value === "") {
        changeAmount("");
        return;
      }

      if (integersOnly) {
        if (!/^\d+$/.test(value)) {
          return;
        }

        const parsedValue = value.replace(/^0+(?=\d)/, "");

        if (parsedValue === "0") {
          changeAmount("");
        } else {
          changeAmount(parsedValue);
        }
        return;
      }

      if (value !== "" && !isAmount(value)) return;
      changeAmount(value.replace(digitRegex, "$1"));
    },
    [changeAmount, digitRegex, integersOnly],
  );

  const handleFillBalance = useCallback(async () => {
    if (!connected) return;

    const spendable = await getMaxAmount({ token, balance, makeMessages: makeMaxAmountMessages });

    changeAmount(integersOnly ? BigNumber(spendable).integerValue(BigNumber.ROUND_DOWN).toString() : spendable);
  }, [connected, balance, token, changeAmount, integersOnly, getMaxAmount, makeMaxAmountMessages]);

  const hasTokenBalance = useMemo(() => {
    if (!connected || balance === "0") return false;

    return true;
  }, [connected, balance]);

  const preventArrowKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (["ArrowUp", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <TokenAmountInputWrapper style={style}>
      <div className="amount">
        <input
          value={amount}
          className="amount-text"
          onChange={onChangeAmountInput}
          placeholder="0"
          onKeyUp={preventArrowKeys}
          onKeyDown={preventArrowKeys}
          autoComplete={"off"}
          spellCheck={"false"}
          inputMode={"decimal"}
        />
        <div className="token">
          <SelectPairIncentivizeButton
            token={token}
            disabled={disabledSelectPair}
            changeToken={changeToken}
            isHiddenArrow={disabledSelectPair}
            poolTokens={poolTokens}
          />
        </div>
      </div>
      <div className="info">
        <span className="price-text disable-pointer ">{usdValue}</span>
        <div className="balance-wrapper">
          {connected && <IconWallet />}
          <span className={`balance-text ${!connected ? "disable-pointer" : ""}`}>{balanceADisplay}</span>
          {isVisibleMaxButton && hasTokenBalance && (
            <button className="balance-max-button" onClick={handleFillBalance} disabled={loadingMaxAmount}>
              {t("common:max")}
            </button>
          )}
        </div>
      </div>
    </TokenAmountInputWrapper>
  );
};

export default TokenAmountInput;
