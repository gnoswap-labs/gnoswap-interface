import React, { useMemo } from "react";
import {
  GnotCollectSwitchWrapper,
  RemoveLiquiditySelectResultWrapper,
} from "./RemoveLiquiditySelectResult.styles";
import { PoolPositionModel } from "@models/position/pool-position-model";
import { useRemoveData } from "@hooks/stake/use-remove-data";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
import BigNumber from "bignumber.js";
import { removeTrailingZeros } from "@utils/number-utils";
import { Divider } from "@components/common/divider/divider";
import Switch from "@components/common/switch/Switch";
import { GNOT_TOKEN } from "@common/values/token-constant";

interface RemoveLiquiditySelectResultProps {
  positions: PoolPositionModel[];
  isWrap: boolean;
  setIsWrap: () => void;
}

const RemoveLiquiditySelectResult: React.FC<
  RemoveLiquiditySelectResultProps
> = ({ positions, isWrap, setIsWrap }) => {
  const { pooledTokenInfos, unclaimedRewards, totalLiquidityUSD } =
    useRemoveData({ selectedPosition: positions });

  const hasGnotToken = useMemo(() => {
    const anyGnotPooledToken = pooledTokenInfos.some(
      item => item.token.path === GNOT_TOKEN.path,
    );
    const anyGnotUnclaimedToken = unclaimedRewards.some(
      item => item.token.path === GNOT_TOKEN.path,
    );

    return anyGnotPooledToken || anyGnotUnclaimedToken;
  }, [pooledTokenInfos, unclaimedRewards]);

  if (positions.length === 0) return <></>;

  return (
    <RemoveLiquiditySelectResultWrapper>
      <ul className="pooled-section">
        {pooledTokenInfos.map((pooledTokenInfo, index) => (
          <li key={index}>
            <div className="main-info">
              <MissingLogo
                symbol={pooledTokenInfo.token.symbol}
                url={pooledTokenInfo.token.logoURI}
                width={24}
                mobileWidth={24}
              />
              <p>Pooled {pooledTokenInfo.token.symbol}</p>
              <strong>
                {removeTrailingZeros(
                  BigNumber(pooledTokenInfo.amount).toFormat(6),
                )}
              </strong>
            </div>
            <span className="dallor">{pooledTokenInfo.amountUSD}</span>
          </li>
        ))}
        {unclaimedRewards.map((pooledTokenInfo, index) => (
          <li key={index}>
            <div className="main-info">
              <MissingLogo
                symbol={pooledTokenInfo.token.symbol}
                url={pooledTokenInfo.token.logoURI}
                width={24}
                mobileWidth={24}
              />
              <p>Unclaimed {pooledTokenInfo.token.symbol}</p>
              <strong>
                {removeTrailingZeros(
                  BigNumber(pooledTokenInfo.amount).toFormat(6),
                )}
              </strong>
            </div>
            <span className="dallor">{pooledTokenInfo.amountUSD}</span>
          </li>
        ))}
        {hasGnotToken && (
          <>
            <Divider />
            <GnotCollectSwitchWrapper>
              <div>Collect as WUGNOT</div>
              <Switch checked={isWrap} onChange={setIsWrap} />
            </GnotCollectSwitchWrapper>
          </>
        )}
      </ul>
      <div className="total-section">
        <h5>Total Amount</h5>
        <span className="total-value">{totalLiquidityUSD}</span>
      </div>
    </RemoveLiquiditySelectResultWrapper>
  );
};

export default RemoveLiquiditySelectResult;
