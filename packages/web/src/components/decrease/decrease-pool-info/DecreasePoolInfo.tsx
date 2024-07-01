import MissingLogo from "@components/common/missing-logo/MissingLogo";
import {
  DecreasePoolInfoWrapper,
  GnotCollectSwitchWrapper,
} from "./DecreasePoolInfo.styles";
import { TokenModel } from "@models/token/token-model";
import React, { useMemo } from "react";
import { useWindowSize } from "@hooks/common/use-window-size";
import { DEVICE_TYPE } from "@styles/media";
import Tooltip from "@components/common/tooltip/Tooltip";
import IconInfo from "@components/common/icons/IconInfo";
import { ToolTipContentWrapper } from "../decrease-select-position/DecreaseSelectPosition.styles";
import BigNumber from "bignumber.js";
import { removeTrailingZeros } from "@utils/number-utils";
import { Divider } from "@components/common/select-token/SelectToken.styles";
import Switch from "@components/common/switch/Switch";

interface Props {
  tokenA: TokenModel;
  tokenB: TokenModel;
  isShowProtocolFee?: boolean;
  pooledTokenInfos: any;
  shouldUnwrap: boolean;
  setShouldUnwrap: () => void;
  displayGnotSwitch?: boolean;
}

const DecreasePoolInfo: React.FC<Props> = ({
  tokenA,
  tokenB,
  pooledTokenInfos,
  isShowProtocolFee = false,
  shouldUnwrap,
  setShouldUnwrap,
  displayGnotSwitch = false,
}) => {
  const { breakpoint } = useWindowSize();

  const poolAMount = useMemo(() => {
    if (Number.isInteger(Number(pooledTokenInfos?.poolAmountA))) {
      return BigNumber(pooledTokenInfos?.poolAmountA).toFormat();
    }

    return removeTrailingZeros(
      BigNumber(pooledTokenInfos?.poolAmountA).toFormat(tokenA.decimals),
    );
  }, [pooledTokenInfos?.poolAmountA, tokenA.decimals]);

  const poolBMount = useMemo(() => {
    if (Number.isInteger(Number(pooledTokenInfos?.poolAmountB))) {
      return BigNumber(pooledTokenInfos?.poolAmountB).toFormat();
    }

    return removeTrailingZeros(
      BigNumber(pooledTokenInfos?.poolAmountB).toFormat(tokenB.decimals),
    );
  }, [pooledTokenInfos?.poolAmountB, tokenB.decimals]);

  const unclaimedPoolAAMount = useMemo(() => {
    if (Number.isInteger(Number(pooledTokenInfos?.unClaimTokenAAmount))) {
      return BigNumber(pooledTokenInfos?.unClaimTokenAAmount).toFormat();
    }

    return BigNumber(pooledTokenInfos?.unClaimTokenAAmount).toFormat(
      tokenA.decimals,
    );
  }, [pooledTokenInfos?.unClaimTokenAAmount, tokenA.decimals]);

  const unclaimedPoolBAMount = useMemo(() => {
    if (Number.isInteger(Number(pooledTokenInfos?.unClaimTokenBAmount))) {
      return BigNumber(pooledTokenInfos?.unClaimTokenBAmount).toFormat();
    }

    return BigNumber(pooledTokenInfos?.unClaimTokenBAmount).toFormat(
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
            <p>Pooled {isNotMobile ? tokenA?.symbol : ""}</p>
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
            <p>Pooled {isNotMobile ? tokenB?.symbol : ""}</p>
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
            <p>Unclaimed {isNotMobile ? tokenA?.symbol : ""} Fees</p>
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
            <p>Unclaimed {isNotMobile ? tokenB?.symbol : ""} Fees</p>
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
              Protocol Fee
              <Tooltip
                placement="top"
                FloatingContent={
                  <ToolTipContentWrapper>
                    The amount of fees charged on the unclaimed fees that goes
                    to the protocol.
                  </ToolTipContentWrapper>
                }
              >
                <IconInfo />
              </Tooltip>
            </p>
            <p className="usd protocol-fee">0%</p>
          </div>
        </div>
      )}
      {displayGnotSwitch && (
        <>
          <Divider />
          <GnotCollectSwitchWrapper>
            <div>Collect as WGNOT</div>
            <Switch checked={shouldUnwrap} onChange={setShouldUnwrap} />
          </GnotCollectSwitchWrapper>
        </>
      )}
    </DecreasePoolInfoWrapper>
  );
};

export default DecreasePoolInfo;
