import React, { useMemo } from "react";
import { RemoveLiquiditySelectResultWrapper } from "./RemoveLiquiditySelectResult.styles";
import BigNumber from "bignumber.js";
import { TokenPairAmountInfo } from "@models/token/token-pair-amount-info";
import { PositionMapper } from "@models/position/mapper/position-mapper";
import { PoolPositionModel } from "@models/position/pool-position-model";

interface RemoveLiquiditySelectResultProps {
  selectedLiquidities: PoolPositionModel[];
}

function mappedTokenPairAmountMap(tokenPairAmounts: TokenPairAmountInfo[]) {
  const initTokenMap: { [key in string]: {
    symbol: string;
    amount: string;
    price: string;
    logoURI: string;
  } } = {};
  const tokenPairMap = tokenPairAmounts.reduce((acc, current) => {
    const tokenA = current.tokenA;
    const tokenB = current.tokenB;
    const tokenAAmount = current.tokenAAmount;
    const tokenBAmount = current.tokenBAmount;
    if (!acc[tokenA.path]) {
      acc[tokenA.path] = {
        symbol: tokenA.symbol,
        logoURI: tokenA.logoURI,
        amount: "0",
        price: "0",
      };
    }
    if (!acc[tokenB.path]) {
      acc[tokenB.path] = {
        symbol: tokenB.symbol,
        logoURI: tokenB.logoURI,
        amount: "0",
        price: "0",
      };
    }
    const token0Amount = BigNumber(acc[tokenA.path].amount).plus(tokenAAmount.amount || "0");
    acc[tokenA.path] = {
      ...acc[tokenA.path],
      amount: token0Amount.toString(),
    };
    const token1Amount = BigNumber(acc[tokenB.path].amount).plus(tokenBAmount.amount || "0");
    acc[tokenB.path] = {
      ...acc[tokenB.path],
      amount: token1Amount.toString(),
    };
    return acc;
  }, initTokenMap);
  return tokenPairMap;
}

const RemoveLiquiditySelectResult: React.FC<
  RemoveLiquiditySelectResultProps
> = ({
  selectedLiquidities
}) => {
    const pooledTokenMap = useMemo(() => {
      const tokenPairAmounts = selectedLiquidities.map(position => PositionMapper.toTokenPairAmount(position));
      return mappedTokenPairAmountMap(tokenPairAmounts);
    }, [selectedLiquidities]);

    const unclaimedTokenMap = useMemo(() => {
      const tokenPairAmounts = selectedLiquidities.map(position => PositionMapper.toTokenPairAmount(position));
      return mappedTokenPairAmountMap(tokenPairAmounts);
    }, [selectedLiquidities]);

    const totalAmount = useMemo(() => {
      const pooledAmount = Object.values(pooledTokenMap)
        .map(token => token.amount)
        .reduce((acc, current) =>
          BigNumber(acc).plus(current).toNumber(), 0);
      const unclaimedAmount = Object.values(unclaimedTokenMap)
        .map(token => token.amount)
        .reduce((acc, current) =>
          BigNumber(acc).plus(current).toNumber(), 0);
      return BigNumber(pooledAmount + unclaimedAmount).toFormat();
    }, [pooledTokenMap, unclaimedTokenMap]);

    if (selectedLiquidities.length === 0) {
      return <></>;
    }

    return (
      <RemoveLiquiditySelectResultWrapper>
        <ul>
          {Object.keys(pooledTokenMap).map((path, index) => (
            <li key={index} className="pooled-tokenA">
              <div className="main-info">
                <img src={pooledTokenMap[path].logoURI} alt="pooled tokenA logo" />
                <p>{`Pooled ${pooledTokenMap[path].symbol}`}</p>
                <strong>{Number(pooledTokenMap[path].amount).toFixed(2)}</strong>
              </div>
              <span className="dallor">{`$${Number(pooledTokenMap[path].amount).toFixed(2)}`}</span>
            </li>
          ))}

          {Object.keys(unclaimedTokenMap).map((path, index) => (
            <li key={index} className="pooled-tokenA">
              <div className="main-info">
                <img src={unclaimedTokenMap[path].logoURI} alt="pooled tokenA logo" />
                <p>{`Unclaimed ${unclaimedTokenMap[path].symbol} Fees`}</p>
                <strong>{Number(unclaimedTokenMap[path].amount).toFixed(2)}</strong>
              </div>
              <span className="dallor">{`$${Number(unclaimedTokenMap[path].amount).toFixed(2)}`}</span>
            </li>
          ))}
        </ul>
        <div className="total-section">
          <h5>Total Amount</h5>
          <span className="total-value">{`$${Number(totalAmount.replace(/,/g, "") || 0).toFixed(2)}`}</span>
        </div>
      </RemoveLiquiditySelectResultWrapper>
    );
  };

export default RemoveLiquiditySelectResult;
