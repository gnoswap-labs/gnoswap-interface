import Range from "@components/common/range/Range";
import { TokenModel } from "@models/token/token-model";
import React from "react";
import DecreasePoolInfo from "../decrease-pool-info/DecreasePoolInfo";
import { DecreaseSelectPositionWrapper } from "./DecreaseSelectPosition.styles";

export interface DecreaseSelectPositionProps {
  tokenA: TokenModel;
  tokenB: TokenModel;
  percent: number;
  handlePercent: (value: number) => void;
  pooledTokenInfos: any;
  shouldUnwrap: boolean;
  setShouldUnwrap: () => void;
}

const DecreaseAmountPosition: React.FC<DecreaseSelectPositionProps> = ({
  tokenA,
  tokenB,
  percent,
  handlePercent,
  pooledTokenInfos,
  shouldUnwrap,
  setShouldUnwrap,
}) => {
  return (
    <DecreaseSelectPositionWrapper>
      <div className="header-wrapper">
        <h5>2. Decreasing Amount</h5>
      </div>
      <div className="select-position common-bg decrease-bg">
        <div className="decrease-percent">
          <p>{percent}%</p>
          <div>
            <div className="box-percent" onClick={() => handlePercent(25)}>
              25%
            </div>
            <div className="box-percent" onClick={() => handlePercent(50)}>
              50%
            </div>
            <div className="box-percent" onClick={() => handlePercent(75)}>
              75%
            </div>
            <div className="box-percent" onClick={() => handlePercent(100)}>
              Max
            </div>
          </div>
        </div>
        <div className="range">
          <Range percent={percent} handlePercent={handlePercent} />
        </div>
      </div>
      <DecreasePoolInfo
        tokenA={tokenA}
        tokenB={tokenB}
        pooledTokenInfos={pooledTokenInfos}
        shouldUnwrap={shouldUnwrap}
        setShouldUnwrap={setShouldUnwrap}
        displayGnotSwitch
      />
    </DecreaseSelectPositionWrapper>
  );
};

export default DecreaseAmountPosition;
