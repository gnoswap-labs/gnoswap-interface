import React, { useMemo } from "react";
import { RemoveLiquiditySelectResultWrapper } from "./RemoveLiquiditySelectResult.styles";
import { LiquidityInfoModel } from "@models/liquidity/liquidity-info-model";
import BigNumber from "bignumber.js";
import { TokenDefaultModel } from "@models/token/token-default-model";

interface RemoveLiquiditySelectResultProps {
  selectedLiquidities: LiquidityInfoModel[];
}

function mappedTokenPairAmountMap(tokenPairs: { token0: TokenDefaultModel, token1: TokenDefaultModel }[]) {
  const initTokenMap: { [key in string]: {
    symbol: string;
    amount: string;
    price: string;
    tokenLogo: string;
  } } = {};
  const tokenPairMap = tokenPairs.reduce((acc, current) => {
    const token0 = current.token0;
    const token1 = current.token1;
    if (!acc[token0.tokenId]) {
      acc[token0.tokenId] = {
        symbol: token0.symbol,
        tokenLogo: token0.tokenLogo,
        amount: "0",
        price: "0",
      };
    }
    if (!acc[token1.tokenId]) {
      acc[token1.tokenId] = {
        symbol: token1.symbol,
        tokenLogo: token1.tokenLogo,
        amount: "0",
        price: "0",
      };
    }
    const token0Amount = BigNumber(acc[token0.tokenId].amount).plus(token0.amount?.value || "0");
    acc[token0.tokenId] = {
      ...acc[token0.tokenId],
      amount: token0Amount.toString(),
    };
    const token1Amount = BigNumber(acc[token1.tokenId].amount).plus(token1.amount?.value || "0");
    acc[token1.tokenId] = {
      ...acc[token1.tokenId],
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
      const tokenPairs = selectedLiquidities.map(liquidity => liquidity.tokenPair);
      return mappedTokenPairAmountMap(tokenPairs);
    }, [selectedLiquidities]);

    const unclaimedTokenMap = useMemo(() => {
      const tokenPairs = selectedLiquidities.map(liquidity => liquidity.fee);
      return mappedTokenPairAmountMap(tokenPairs);
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
          {Object.keys(pooledTokenMap).map((tokenId, index) => (
            <li key={index} className="pooled-token0">
              <div className="main-info">
                <img src={pooledTokenMap[tokenId].tokenLogo} alt="pooled token0 logo" />
                <p>{`Pooled ${pooledTokenMap[tokenId].symbol}`}</p>
                <strong>{pooledTokenMap[tokenId].amount}</strong>
              </div>
              <span className="dallor">{`$${pooledTokenMap[tokenId].amount}`}</span>
            </li>
          ))}

          {Object.keys(unclaimedTokenMap).map((tokenId, index) => (
            <li key={index} className="pooled-token0">
              <div className="main-info">
                <img src={unclaimedTokenMap[tokenId].tokenLogo} alt="pooled token0 logo" />
                <p>{`Unclaimed ${unclaimedTokenMap[tokenId].symbol} Fees`}</p>
                <strong>{unclaimedTokenMap[tokenId].amount}</strong>
              </div>
              <span className="dallor">{`$${unclaimedTokenMap[tokenId].amount}`}</span>
            </li>
          ))}
        </ul>
        <div className="total-section">
          <h5>Total</h5>
          <span className="total-value">{`$${totalAmount}`}</span>
        </div>
      </RemoveLiquiditySelectResultWrapper>
    );
  };

export default RemoveLiquiditySelectResult;
