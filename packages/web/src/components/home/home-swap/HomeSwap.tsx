import React, { useCallback } from "react";
import { cx } from "@emotion/css";
import { wrapper } from "./HomeSwap.styles";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import SelectPairButton from "@components/common/select-pair-button/SelectPairButton";
import IconSwapArrowDown from "@components/common/icons/IconSwapArrowDown";
import { SwapTokenInfo } from "@models/swap/swap-token-info";
import { useWindowSize } from "@hooks/common/use-window-size";
import { useTranslation } from "next-i18next";
import IconRightArrow from "@components/common/icons/IconRightArrow";
import { TokenModel } from "@models/token/token-model";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";
import IconWallet from "@components/common/icons/IconWallet";

interface HomeSwapProps {
  swapTokenInfo: SwapTokenInfo;
  swapNow: () => void;
  connected: boolean;
  tokenBTransition?: {
    isChanging: boolean;
    prevToken: TokenModel | null;
  };
  defaultTokenAAmount?: string;
}

const HomeSwap: React.FC<HomeSwapProps> = ({
  swapTokenInfo,
  swapNow,
  connected,
  tokenBTransition,
  defaultTokenAAmount,
}) => {
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
            <div className="amount-text">{defaultTokenAAmount}</div>
            <div className="token">
              <SelectPairButton token={swapTokenInfo.tokenA} hiddenModal />
            </div>
          </div>
          <div className="info">
            <span className="price-text">{swapTokenInfo.tokenAUSDStr}</span>
            <span className={`balance-text ${connected ? "balance-text-disabled" : ""}`}>
              <IconWallet />
              1,000
            </span>
          </div>
        </div>
        <div className="to">
          <div className="amount">
            <div className="skeleton" css={pulseSkeletonStyle({ w: "100px", h: "32px" })} />
            <div className="token">
              <SelectPairButton token={swapTokenInfo.tokenB} hiddenModal isChanging={tokenBTransition?.isChanging} />
            </div>
          </div>
          <div className="info">
            <div className="skeleton" css={pulseSkeletonStyle({ w: "77px", h: "16px" })} />
            {tokenBTransition?.isChanging ? (
              <div className="skeleton" css={pulseSkeletonStyle({ w: "40px", h: "16px" })} />
            ) : (
              <span
                className={cx("balance-text", {
                  "balance-text-disabled": connected,
                  isChanging: tokenBTransition?.isChanging,
                })}
              >
                <IconWallet />0
              </span>
            )}
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
              Go to Swap <IconRightArrow className="right-arrow" />
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
