import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { DecreasePoolInfoWrapper } from "./DecreasePoolInfo.styles";
import { TokenModel } from "@models/token/token-model";
import React from "react";
import { useWindowSize } from "@hooks/common/use-window-size";
import { DEVICE_TYPE } from "@styles/media";

interface Props {
  tokenA: TokenModel;
  tokenB: TokenModel;
  isShowProtocolFee?: boolean;
}

const DecreasePoolInfo: React.FC<Props> = ({
  tokenA,
  tokenB,
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
          <p>123,456.058</p>
        </div>
        <div className="usd">$32,561.23</div>
      </div>
      <div className="box-info">
        <div className="value">
          <div>
            <MissingLogo symbol={tokenB?.symbol} url={tokenB?.logoURI} width={24} />
            <p>Pooled {isNotMobile ? tokenB?.symbol : ""}</p>
          </div>
          <p>123,456.058</p>
        </div>
        <div className="usd">$32,561.23</div>
      </div>
      <div className="box-info">
        <div className="value">
          <div>
            <MissingLogo symbol={tokenA?.symbol} url={tokenA?.logoURI} width={24} />
            <p>Unclaimed Fees {isNotMobile ? tokenA?.symbol : ""}</p>
          </div>
          <p>123,456.058</p>
        </div>
        <div className="usd">$32,561.23</div>
      </div>
      <div className="box-info">
        <div className="value">
          <div>
            <MissingLogo symbol={tokenB?.symbol} url={tokenB?.logoURI} width={24} />
            <p>Unclaimed Fees {isNotMobile ? tokenB?.symbol : ""}</p>
          </div>
          <p>123,456.058</p>
        </div>
        <div className="usd">$32,561.23</div>
      </div>
      {isShowProtocolFee && <div className="divider"></div>}
      {isShowProtocolFee && <div className="box-info">
        <div className="value">
            <p className="protocol-fee">Protocol Fee</p>
          <p className="usd protocol-fee">0%</p>
        </div>
      </div>}
    </DecreasePoolInfoWrapper>
  );
};

export default DecreasePoolInfo;
