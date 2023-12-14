import React from "react";
import { RemoveLiquiditySelectResultWrapper } from "./RemoveLiquiditySelectResult.styles";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { useRemoveData } from "@hooks/stake/use-remove-data";

interface RemoveLiquiditySelectResultProps {
  positions: PoolPositionModel[];
}

const RemoveLiquiditySelectResult: React.FC<
  RemoveLiquiditySelectResultProps
> = ({
  positions
}) => {
    const { pooledTokenInfos, unclaimedRewards, totalLiquidityUSD } = useRemoveData({ positions });

    if (positions.length === 0) return <></>;

    return (
      <RemoveLiquiditySelectResultWrapper>
        <ul className="pooled-section">
          {pooledTokenInfos.map((pooledTokenInfo, index) => (
            <li key={index}>
              <div className="main-info">
                <img src={pooledTokenInfo.token.logoURI} alt="pooled token logo" />
                <p>Pooled {pooledTokenInfo.token.symbol}</p>
                <strong>{pooledTokenInfo.amount}</strong>
              </div>
              <span className="dallor">{pooledTokenInfo.amountUSD}</span>
            </li>
          ))}
          {unclaimedRewards.map((pooledTokenInfo, index) => (
            <li key={index}>
              <div className="main-info">
                <img src={pooledTokenInfo.token.logoURI} alt="pooled token logo" />
                <p>Unclaimed {pooledTokenInfo.token.symbol}</p>
                <strong>{pooledTokenInfo.amount}</strong>
              </div>
              <span className="dallor">{pooledTokenInfo.amountUSD}</span>
            </li>
          ))}
        </ul>
        <div className="total-section">
          <h5>Total Amount</h5>
          <span className="total-value">{totalLiquidityUSD}</span>
        </div>
      </RemoveLiquiditySelectResultWrapper>
    );
  };

export default RemoveLiquiditySelectResult;
