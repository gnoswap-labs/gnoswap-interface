import React, { useCallback, useState } from "react";
import { wrapper } from "./HomeSwap.styles";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import SelectPairButton from "@components/common/select-pair-button/SelectPairButton";
import IconSwapArrowDown from "@components/common/icons/IconSwapArrowDown";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { useWindowSize } from "@hooks/common/use-window-size";
import { SwapValue } from "@states/swap";
import { useTranslation } from "next-i18next";

interface HomeSwapProps {
  changeTokenAAmount: (value: string) => void;
  changeTokenBAmount: (value: string) => void;
  swapTokenInfo: SwapTokenInfo;
  swapNow: () => void;
  onSubmitSwapValue: () => void;
  connected: boolean;
  swapValue: SwapValue;
}

function isAmount(str: string) {
  const regex = /^\d+(\.\d*)?$/;
  return regex.test(str);
}

const HomeSwap: React.FC<HomeSwapProps> = ({
  swapTokenInfo,
  swapNow,
  onSubmitSwapValue,
  changeTokenAAmount,
  connected,
  changeTokenBAmount,
}) => {
  const { t } = useTranslation();
  const { breakpoint } = useWindowSize();
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");

  const onChangeFromAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value !== "" && !isAmount(value)) return;
      const temp = value.replace(/^0+(?=\d)|(\.\d*)$/g, "$1");
      setFromAmount(temp);
      changeTokenAAmount(temp);
    },
    [],
  );

  const onChangeToAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (value !== "" && !isAmount(value)) return;
      const temp = value.replace(/^0+(?=\d)|(\.\d*)$/g, "$1");
      setToAmount(temp);
      changeTokenBAmount(temp);
    },
    [],
  );

  const onClickSwapNow = useCallback(() => {
    swapNow();
  }, [swapNow]);

  const handleSwap = () => {
    setFromAmount(toAmount);
    setToAmount(fromAmount);
    onSubmitSwapValue();
  };

  const handleAutoFillTokenA = useCallback(() => {
    if (connected) {
      const formatValue = parseFloat(
        swapTokenInfo.tokenABalance.replace(/,/g, ""),
      ).toString();
      setFromAmount(formatValue);
      changeTokenAAmount(formatValue);
    }
  }, [connected, swapTokenInfo.tokenABalance, changeTokenAAmount]);

  const handleAutoFillTokenB = useCallback(() => {
    if (connected) {
      const formatValue = parseFloat(
        swapTokenInfo.tokenBBalance.replace(/,/g, ""),
      ).toString();
      setToAmount(formatValue);
      changeTokenBAmount(formatValue);
    }
  }, [swapTokenInfo.tokenBBalance, connected, setToAmount, changeTokenBAmount]);

  return breakpoint === "tablet" || breakpoint === "web" ? (
    <div css={wrapper}>
      <div className="header">
        <span className="title">{t("common:action.swap")}</span>
      </div>
      <div className="inputs">
        <div className="from">
          <div className="amount">
            <input
              className="amount-text"
              value={fromAmount}
              onChange={onChangeFromAmount}
              placeholder="0"
            />
            <div className="token">
              <SelectPairButton
                token={swapTokenInfo.tokenA}
                hiddenModal
                isHiddenArrow
              />
            </div>
          </div>
          <div className="info">
            <span className="price-text">{swapTokenInfo.tokenAUSDStr}</span>
            <span
              className={`balance-text ${
                connected ? "balance-text-disabled" : ""
              }`}
              onClick={handleAutoFillTokenA}
            >
              {`${t("Main:bal")}: ${swapTokenInfo.tokenABalance}`}
            </span>
          </div>
        </div>
        <div className="to">
          <div className="amount">
            <input
              className="amount-text"
              value={toAmount}
              onChange={onChangeToAmount}
              placeholder="0"
            />
            <div className="token">
              <SelectPairButton
                token={swapTokenInfo.tokenB}
                hiddenModal
                isHiddenArrow
              />
            </div>
          </div>
          <div className="info">
            <span className="price-text">{swapTokenInfo.tokenBUSDStr}</span>
            <span
              className={`balance-text ${
                connected ? "balance-text-disabled" : ""
              }`}
              onClick={handleAutoFillTokenB}
            >
              {t("Main:bal")}: {swapTokenInfo.tokenBBalance}
            </span>
          </div>
        </div>
        <div className="arrow">
          <div className="shape" onClick={handleSwap}>
            <IconSwapArrowDown className="shape-icon" />
          </div>
        </div>
      </div>

      <div className="footer">
        <Button
          text={t("Main:swapNowBtn")}
          style={{
            fullWidth: true,
            height: 50,
            fontType: "body7",
            hierarchy: ButtonHierarchy.Primary,
          }}
          onClick={onClickSwapNow}
        />
      </div>
    </div>
  ) : null;
};

export default HomeSwap;
