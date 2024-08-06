import BigNumber from "bignumber.js";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import IconInfo from "@components/common/icons/IconInfo";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { Divider } from "@components/common/select-token/SelectToken.styles";
import Switch from "@components/common/switch/Switch";
import Tooltip from "@components/common/tooltip/Tooltip";
import { useWindowSize } from "@hooks/common/use-window-size";
import { IPooledTokenInfo } from "@hooks/decrease/use-decrease-handle";
import { TokenModel } from "@models/token/token-model";
import { useGetWithdrawalFee } from "@query/pools";
import { DEVICE_TYPE } from "@styles/media";
import { removeTrailingZeros } from "@utils/number-utils";

import { ToolTipContentWrapper } from "../decrease-select-position/DecreaseSelectPosition.styles";
import {
  DecreasePoolInfoWrapper,
  GnotCollectSwitchWrapper
} from "./DecreasePoolInfo.styles";

interface Props {
  tokenA: TokenModel;
  tokenB: TokenModel;
  isShowProtocolFee?: boolean;
  pooledTokenInfos: IPooledTokenInfo | null;
  isWrap?: boolean;
  setIsWrap?: () => void;
  displayGnotSwitch?: boolean;
}

const DecreasePoolInfo: React.FC<Props> = ({
  tokenA,
  tokenB,
  pooledTokenInfos,
  isShowProtocolFee = false,
  isWrap = false,
  setIsWrap = () => {
    return;
  },
  displayGnotSwitch = false,
}) => {
  const { t } = useTranslation();

  const { breakpoint } = useWindowSize();
  const { data: withdrawalFee } = useGetWithdrawalFee();

  const poolAMount = useMemo(() => {
    if (Number.isInteger(Number(pooledTokenInfos?.poolAmountA))) {
      return BigNumber(pooledTokenInfos?.poolAmountA ?? 0).toFormat();
    }

    return removeTrailingZeros(
      BigNumber(pooledTokenInfos?.poolAmountA ?? 0).toFormat(tokenA.decimals),
    );
  }, [pooledTokenInfos?.poolAmountA, tokenA.decimals]);

  const poolBMount = useMemo(() => {
    if (Number.isInteger(Number(pooledTokenInfos?.poolAmountB))) {
      return BigNumber(pooledTokenInfos?.poolAmountB ?? 0).toFormat();
    }

    return removeTrailingZeros(
      BigNumber(pooledTokenInfos?.poolAmountB ?? 0).toFormat(tokenB.decimals),
    );
  }, [pooledTokenInfos?.poolAmountB, tokenB.decimals]);

  const unclaimedPoolAAMount = useMemo(() => {
    if (Number.isInteger(Number(pooledTokenInfos?.unClaimTokenAAmount))) {
      return BigNumber(pooledTokenInfos?.unClaimTokenAAmount ?? 0).toFormat();
    }

    return BigNumber(pooledTokenInfos?.unClaimTokenAAmount ?? 0).toFormat(
      tokenA.decimals,
    );
  }, [pooledTokenInfos?.unClaimTokenAAmount, tokenA.decimals]);

  const unclaimedPoolBAMount = useMemo(() => {
    if (Number.isInteger(Number(pooledTokenInfos?.unClaimTokenBAmount))) {
      return BigNumber(pooledTokenInfos?.unClaimTokenBAmount ?? 0).toFormat();
    }

    return BigNumber(pooledTokenInfos?.unClaimTokenBAmount ?? 0).toFormat(
      tokenA.decimals,
    );
  }, [pooledTokenInfos?.unClaimTokenBAmount, tokenA.decimals]);

  const isNotMobile = breakpoint !== DEVICE_TYPE.MOBILE;
  return (
    <DecreasePoolInfoWrapper>
      <div className="box-info">
        <div className="value">
          <div>
            <MissingLogo
              symbol={tokenA?.symbol}
              url={tokenA?.logoURI}
              width={24}
            />
            <p>
              {t("DecreaseLiquidity:form.pooled")}{" "}
              {isNotMobile ? tokenA?.symbol : ""}
            </p>
          </div>
          <p>{poolAMount}</p>
        </div>
        <div className="usd">{pooledTokenInfos?.poolAmountUSDA}</div>
      </div>
      <div className="box-info">
        <div className="value">
          <div>
            <MissingLogo
              symbol={tokenB?.symbol}
              url={tokenB?.logoURI}
              width={24}
            />
            <p>
              {t("DecreaseLiquidity:form.pooled")}{" "}
              {isNotMobile ? tokenB?.symbol : ""}
            </p>
          </div>
          <p>{poolBMount}</p>
        </div>
        <div className="usd">{pooledTokenInfos?.poolAmountUSDB}</div>
      </div>
      <div className="box-info">
        <div className="value">
          <div>
            <MissingLogo
              symbol={tokenA?.symbol}
              url={tokenA?.logoURI}
              width={24}
            />
            <p>
              {t("DecreaseLiquidity:form.pooled")}{" "}
              {isNotMobile ? tokenA?.symbol : ""}{" "}
              {t("DecreaseLiquidity:form.fees")}
            </p>
          </div>
          <p>{unclaimedPoolAAMount}</p>
        </div>
        <div className="usd">{pooledTokenInfos?.unClaimTokenAAmountUSD}</div>
      </div>
      <div className="box-info">
        <div className="value">
          <div>
            <MissingLogo
              symbol={tokenB?.symbol}
              url={tokenB?.logoURI}
              width={24}
            />
            <p>
              {" "}
              {t("DecreaseLiquidity:form.pooled")}{" "}
              {isNotMobile ? tokenB?.symbol : ""}{" "}
              {t("DecreaseLiquidity:form.fees")}
            </p>
          </div>
          <p>{unclaimedPoolBAMount}</p>
        </div>
        <div className="usd">{pooledTokenInfos?.unClaimTokenBAmountUSD}</div>
      </div>
      {isShowProtocolFee && <Divider />}
      {isShowProtocolFee && (
        <div className="box-info">
          <div className="value">
            <p className="protocol-fee">
              {t("business:protocolFee.txt")}
              <Tooltip
                placement="top"
                FloatingContent={
                  <ToolTipContentWrapper>
                    {t("business:protocolFee.desc")}
                  </ToolTipContentWrapper>
                }
              >
                <IconInfo />
              </Tooltip>
            </p>
            <p className="usd protocol-fee">
              {withdrawalFee ? `${(withdrawalFee || 0) / 100}%` : "-"}
            </p>
          </div>
        </div>
      )}
      {displayGnotSwitch && (
        <>
          <Divider />
          <GnotCollectSwitchWrapper>
            <div>{t("DecreaseLiquidity:form.collectWugnot.switch")}</div>
            <Switch checked={isWrap} onChange={setIsWrap} />
          </GnotCollectSwitchWrapper>
        </>
      )}
    </DecreasePoolInfoWrapper>
  );
};

export default DecreasePoolInfo;
