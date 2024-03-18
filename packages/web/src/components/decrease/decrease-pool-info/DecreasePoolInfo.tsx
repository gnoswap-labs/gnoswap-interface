import MissingLogo from "@components/common/missing-logo/MissingLogo";
import { DecreasePoolInfoWrapper } from "./DecreasePoolInfo.styles";
import { TokenModel } from "@models/token/token-model";
import React from "react";

interface Props {
  tokenA: TokenModel;
  tokenB: TokenModel;
}

const DecreasePoolInfo: React.FC<Props> = ({
  tokenA,
  tokenB,
}) => {
  return (
    <DecreasePoolInfoWrapper>
      <div className="box-info">
        <div className="value">
          <div>
            <MissingLogo symbol={tokenA?.symbol} url={tokenA?.logoURI} width={24} />
            <p>Pooled {tokenA?.symbol}</p>
          </div>
          <p>123,456.058845</p>
        </div>
        <div className="usd">$32,561.23</div>
      </div>
      <div className="box-info">
        <div className="value">
          <div>
            <MissingLogo symbol={tokenB?.symbol} url={tokenB?.logoURI} width={24} />
            <p>Pooled {tokenB?.symbol}</p>
          </div>
          <p>123,456.058845</p>
        </div>
        <div className="usd">$32,561.23</div>
      </div>
      <div className="box-info">
        <div className="value">
          <div>
            <MissingLogo symbol={tokenA?.symbol} url={tokenA?.logoURI} width={24} />
            <p>Unclaimed Fees {tokenA?.symbol}</p>
          </div>
          <p>123,456.058845</p>
        </div>
        <div className="usd">$32,561.23</div>
      </div>
      <div className="box-info">
        <div className="value">
          <div>
            <MissingLogo symbol={tokenB?.symbol} url={tokenB?.logoURI} width={24} />
            <p>Unclaimed Fees {tokenB?.symbol}</p>
          </div>
          <p>123,456.058845</p>
        </div>
        <div className="usd">$32,561.23</div>
      </div>
      <div className="box-info">
        <div className="value">
            <p>Protocol Fee</p>
          <p className="usd">0%</p>
        </div>
      </div>
    </DecreasePoolInfoWrapper>
  );
};

export default DecreasePoolInfo;
