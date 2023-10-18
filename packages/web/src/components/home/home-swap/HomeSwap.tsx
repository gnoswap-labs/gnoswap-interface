import React, { useCallback } from "react";
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
}

function isAmount(str: string) {
  const regex = /^\d+(\.\d*)?$/;
  return regex.test(str);
}

const HomeSwap: React.FC<HomeSwapProps> = ({
  swapTokenInfo,
  swapNow,
}) => {
  const { breakpoint } = useWindowSize();

  const onChangeFromAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      if (value !== "" && !isAmount(value)) return;

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

  return breakpoint === "web" ? (
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
              value={swapTokenInfo.tokenAAmount}
              onChange={onChangeFromAmount}
              placeholder="0"
            />
            <div className="token">
              <SelectPairButton disabled token={swapTokenInfo.tokenA} />
            </div>
          </div>
          <div className="info">
            <span className="price-text">{swapTokenInfo.tokenAUSDStr}</span>
            <span className="balance-text">Balance : {swapTokenInfo.tokenABalance}</span>
          </div>
        </div>
        <div className="to">
          <div className="amount">
            <input
              className="amount-text"
              value={swapTokenInfo.tokenBAmount}
              onChange={onChangeToAmount}
              placeholder="0"
            />
            <div className="token">
              <SelectPairButton disabled token={swapTokenInfo.tokenB} />
            </div>
          </div>
          <div className="info">
            <span className="price-text">{swapTokenInfo.tokenBUSDStr}</span>
            <span className="balance-text">Balance : {swapTokenInfo.tokenBBalance}</span>
          </div>
        </div>
        <div className="arrow">
          <div className="shape">
            <IconSwapArrowDown className="shape-icon" />
          </div>
        </div>
      </div>

      <div className="footer">
        <Button
          text="Swap now"
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
