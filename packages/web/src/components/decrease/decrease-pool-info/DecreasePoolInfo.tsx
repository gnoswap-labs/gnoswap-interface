import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { DecreasePoolInfoWrapper } from "./DecreasePoolInfo.styles";
import { TokenModel } from "@models/token/token-model";
import React from "react";
import { useWindowSize } from "@hooks/common/use-window-size";
import { DEVICE_TYPE } from "@styles/media";
import Tooltip from "@components/common/tooltip/Tooltip";
import IconInfo from "@components/common/icons/IconInfo";
import { ToolTipContentWrapper } from "../decrease-select-position/DecreaseSelectPosition.styles";
import BigNumber from "bignumber.js";

interface Props {
  tokenA: TokenModel;
  tokenB: TokenModel;
  isShowProtocolFee?: boolean;
  pooledTokenInfos: any;
}

const DecreasePoolInfo: React.FC<Props> = ({
  tokenA,
  tokenB,
  pooledTokenInfos,
  isShowProtocolFee = false,
}) => {
  const { breakpoint } = useWindowSize();

  const isNotMobile = breakpoint !== DEVICE_TYPE.MOBILE;
  return (
    <DecreasePoolInfoWrapper>
      <div className="box-info">
        <div className="value">
          <div>
            <MissingLogo symbol={tokenA?.symbol} url={tokenA?.logoURI} width={24} />
            <p>Pooled {isNotMobile ? tokenA?.symbol : ""}</p>
          </div>
          <p>{BigNumber(pooledTokenInfos?.poolAmountA).toFixed(tokenA.decimals)}</p>
        </div>
        <div className="usd">{pooledTokenInfos?.poolAmountUSDA}</div>
      </div>
      <div className="box-info">
        <div className="value">
          <div>
            <MissingLogo symbol={tokenB?.symbol} url={tokenB?.logoURI} width={24} />
            <p>Pooled {isNotMobile ? tokenB?.symbol : ""}</p>
          </div>
          <p>{BigNumber(pooledTokenInfos?.poolAmountB).toFixed(tokenB.decimals)}</p>
        </div>
        <div className="usd">{pooledTokenInfos?.poolAmountUSDB}</div>
      </div>
      <div className="box-info">
        <div className="value">
          <div>
            <MissingLogo symbol={tokenA?.symbol} url={tokenA?.logoURI} width={24} />
            <p>Unclaimed {isNotMobile ? tokenA?.symbol : ""} Fees</p>
          </div>
          <p>{BigNumber(pooledTokenInfos?.unClaimTokenAAmount).toFixed(tokenA.decimals)}</p>
        </div>
        <div className="usd">{pooledTokenInfos?.unClaimTokenAAmountUSD}</div>
      </div>
      <div className="box-info">
        <div className="value">
          <div>
            <MissingLogo symbol={tokenB?.symbol} url={tokenB?.logoURI} width={24} />
            <p>Unclaimed {isNotMobile ? tokenB?.symbol : ""} Fees</p>
          </div>
          <p>{BigNumber(pooledTokenInfos?.unClaimTokenBAmount).toFixed(tokenB.decimals)}</p>
        </div>
        <div className="usd">{pooledTokenInfos?.unClaimTokenBAmountUSD}</div>
      </div>
      {isShowProtocolFee && <div className="divider"></div>}
      {isShowProtocolFee && <div className="box-info">
        <div className="value">
          <p className="protocol-fee">Protocol Fee
            <Tooltip placement="top" FloatingContent={<ToolTipContentWrapper>The amount of fees charged on the unclaimed fees that goes to the protocol.</ToolTipContentWrapper>}>
              <IconInfo />
            </Tooltip>
          </p>
          <p className="usd protocol-fee">0%</p>
        </div>
      </div>}
    </DecreasePoolInfoWrapper>
  );
};

export default DecreasePoolInfo;
