import React, { useCallback } from "react";
import { wrapper } from "./HomeSwap.styles";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import SelectPairButton from "@components/common/select-pair-button/SelectPairButton";
import IconSwapArrowDown from "@components/common/icons/IconSwapArrowDown";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { useWindowSize } from "@hooks/common/use-window-size";
import { SwapValue } from "@states/swap";
import { useTranslation } from "next-i18next";
import IconRightArrow from "@components/common/icons/IconRightArrow";

interface HomeSwapProps {
  swapTokenInfo: SwapTokenInfo;
  swapNow: () => void;
  connected: boolean;
  swapValue: SwapValue;
}

const HomeSwap: React.FC<HomeSwapProps> = ({ swapTokenInfo, swapNow, connected, swapValue }) => {
  const { t } = useTranslation();
  const { breakpoint } = useWindowSize();

  const onClickSwapNow = useCallback(() => {
    swapNow();
  }, [swapNow]);

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
              value={swapValue.tokenAAmount}
              placeholder="0"
              autoComplete={"off"}
              spellCheck={"false"}
            />
            <div className="token">
              <SelectPairButton token={swapTokenInfo.tokenA} hiddenModal isHiddenArrow />
            </div>
          </div>
          <div className="info">
            <span className="price-text">{swapTokenInfo.tokenAUSDStr}</span>
            <span className={`balance-text ${connected ? "balance-text-disabled" : ""}`}>
              {`${t("Main:bal")}: ${swapTokenInfo.tokenABalance}`}
            </span>
          </div>
        </div>
        <div className="to">
          <div className="amount">
            <input className="amount-text" value={"0"} placeholder="0" autoComplete={"off"} spellCheck={"false"} />
            <div className="token">
              <SelectPairButton token={swapTokenInfo.tokenB} hiddenModal isHiddenArrow />
            </div>
          </div>
          <div className="info">
            <span className="price-text">{swapTokenInfo.tokenBUSDStr}</span>
            <span className={`balance-text ${connected ? "balance-text-disabled" : ""}`}>
              {t("Main:bal")}: {swapTokenInfo.tokenBBalance}
            </span>
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
          text={
            <div className="swap-button">
              Go to Swap <IconRightArrow />
            </div>
          }
          // text={t("Main:swapNowBtn")}
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
