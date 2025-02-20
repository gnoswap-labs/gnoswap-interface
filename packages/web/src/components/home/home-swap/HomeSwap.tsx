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
  tokenB: TokenModel | null;
}

// Interface for animating token conversions
interface TokenTransition {
  isChanging: boolean;
  prevToken: TokenModel | null;
}

const UI_SAMPLE_MIN = 0;
const UI_SAMPLE_VALUE = 1_000;
const TOKEN_TRANSITION_DURATION = 500 as const;

const HomeSwap: React.FC<HomeSwapProps> = ({ swapTokenInfo, swapNow, connected, tokenB }) => {
  const { t } = useTranslation();
  const { breakpoint } = useWindowSize();

  // Manage the transition state of token B (for animation purposes)
  const [tokenBTransition, setTokenBTransition] = React.useState<TokenTransition>({
    isChanging: true,
    prevToken: null,
  });

  React.useEffect(() => {
    // when the token has actually changed
    if (tokenB && tokenBTransition.prevToken && tokenBTransition.prevToken.path !== tokenB.path) {
      // Set transition to start state
      setTokenBTransition(prev => ({
        isChanging: true,
        prevToken: prev.prevToken,
      }));

      // Change to transition complete after 500ms
      const timer = setTimeout(() => {
        setTokenBTransition({
          isChanging: false,
          prevToken: tokenB,
        });
      }, TOKEN_TRANSITION_DURATION);

      return () => clearTimeout(timer);
      // on initial token setup
    } else if (tokenB && !tokenBTransition.prevToken) {
      setTokenBTransition({
        isChanging: false,
        prevToken: tokenB,
      });
    }
  }, [tokenB]);

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
            <div className="amount-text">{UI_SAMPLE_VALUE}</div>
            <div className="token">
              <SelectPairButton token={swapTokenInfo.tokenA} hiddenModal />
            </div>
          </div>
          <div className="info">
            <span className="price-text">{swapTokenInfo.tokenAUSDStr}</span>
            <span className={`balance-text ${connected ? "balance-text-disabled" : ""}`}>
              <IconWallet />
              {UI_SAMPLE_VALUE.toLocaleString()}
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
                <IconWallet />
                {UI_SAMPLE_MIN}
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
