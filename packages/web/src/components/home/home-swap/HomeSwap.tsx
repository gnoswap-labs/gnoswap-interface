import React, { useCallback, useState } from "react";
import { wrapper } from "./HomeSwap.styles";
import IconSettings from "@components/common/icons/IconSettings";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import SelectPairButton from "@components/common/select-pair-button/SelectPairButton";
import IconSwapArrowDown from "@components/common/icons/IconSwapArrowDown";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { useWindowSize } from "@hooks/common/use-window-size";

interface HomeSwapProps {
  swapTokenInfo: SwapTokenInfo;
  swapNow: () => void;
  onSubmitSwapValue: () => void;
}

function isAmount(str: string) {
  const regex = /^\d+(\.\d*)?$/;
  return regex.test(str);
}

const HomeSwap: React.FC<HomeSwapProps> = ({ swapTokenInfo, swapNow, onSubmitSwapValue }) => {
  const { breakpoint } = useWindowSize();
  const [fromAmount, setFromAmount] = useState("0");
  const [toAmount, setToAmount] = useState("0");

  const onChangeFromAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (value !== "" && !isAmount(value)) return;
      setFromAmount(value);
      // TODO
      // - mapT0AmountToT0Price
      // - mapT0AmpuntT1Amount
      // - mapT1AmpuntT1Price
    },
    [],
  );

  const onChangeToAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (value !== "" && !isAmount(value)) return;
      setToAmount(value);
      // TODO
      // - mapT1AmountToT1Price
      // - mapT1AmpuntT0Amount
      // - mapT0AmpuntT0Price
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

  return breakpoint === "tablet" || breakpoint === "web" ? (
    <div css={wrapper}>
      <div className="header">
        <span className="title">Swap</span>
        <button className="setting-button" disabled>
          <IconSettings className="setting-icon" />
        </button>
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
              <SelectPairButton token={swapTokenInfo.tokenA} hiddenModal isHiddenArrow />
            </div>
          </div>
          <div className="info">
            <span className="price-text">{swapTokenInfo.tokenAUSDStr}</span>
            <span className="balance-text">
              Balance: {swapTokenInfo.tokenABalance}
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
              <SelectPairButton token={swapTokenInfo.tokenB} hiddenModal isHiddenArrow />
            </div>
          </div>
          <div className="info">
            <span className="price-text">{swapTokenInfo.tokenBUSDStr}</span>
            <span className="balance-text">
              Balance: {swapTokenInfo.tokenBBalance}
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
          text="Swap Now"
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
