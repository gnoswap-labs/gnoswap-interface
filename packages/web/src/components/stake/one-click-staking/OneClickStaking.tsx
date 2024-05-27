import { Divider, OneClickStakingWrapper } from "./OneClickStaking.styles";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconStrokeArrowRight from "@components/common/icons/IconStrokeArrowRight";
import { useAtom } from "jotai";
import { SwapState } from "@states/index";
import DoubleTokenLogo from "@components/common/double-token-logo/DoubleTokenLogo";
import { PositionModel } from "@models/position/position-model";
import { useMemo, useState, useEffect } from "react";
import { convertToKMB, formatUsdNumber } from "@utils/stake-position-utils";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import OverlapLogo from "@components/common/overlap-logo/OverlapLogo";
import { TokenModel } from "@models/token/token-model";
import { toUnitFormat } from "@utils/number-utils";
import { numberToRate } from "@utils/string-utils";
interface Props {
  stakedPositions: PositionModel[];
  unstakedPositions: PositionModel[];
  handleClickGotoStaking: () => void;
  pool: PoolDetailModel;
  isLoadingPool: boolean;
}

const OneClickStaking: React.FC<Props> = ({
  stakedPositions,
  unstakedPositions,
  handleClickGotoStaking,
  pool,
  isLoadingPool,
}) => {
  const [swapValue] = useAtom(SwapState.swap);
  const { getGnotPath } = useGnotToGnot();
  const { tokenA: tokenAInfo = null, tokenB: tokenBInfo = null } = swapValue;
  const [initialized, setInitialized] = useState<{
    tokenA: TokenModel | null;
    tokenB: TokenModel | null;
  }>({ tokenA: null, tokenB: null });

  const tokenA = tokenAInfo
    ? {
      ...tokenAInfo,
      logoURI: getGnotPath(tokenAInfo).logoURI,
      path: getGnotPath(tokenAInfo).path,
      name: getGnotPath(tokenAInfo).name,
      symbol: getGnotPath(tokenAInfo).symbol,
    }
    : null;

  const tokenB = tokenBInfo
    ? {
      ...tokenBInfo,
      logoURI: getGnotPath(tokenBInfo).logoURI,
      path: getGnotPath(tokenBInfo).path,
      name: getGnotPath(tokenBInfo).name,
      symbol: getGnotPath(tokenBInfo).symbol,
    }
    : null;

  useEffect(() => {
    const temp = [
      initialized?.tokenA?.symbol,
      initialized?.tokenB?.symbol,
    ].sort();
    const tempToken = [tokenA?.symbol, tokenB?.symbol].sort();
    const condition = temp[0] === tempToken[0] && temp[1] === tempToken[1];

    if (!condition) {
      setInitialized({ tokenA, tokenB });
    }
  }, [tokenA?.symbol, tokenB?.symbol, initialized]);

  const isStakedPositions = useMemo(() => {
    return stakedPositions.length > 0;
  }, [stakedPositions]);

  const tokenARevert = useMemo(() => {
    return initialized?.tokenA;
  }, [initialized]);

  const tokenBRevert = useMemo(() => {
    return initialized?.tokenB;
  }, [initialized]);

  const isUnstakedPositions = useMemo(() => {
    return unstakedPositions.length > 0;
  }, [unstakedPositions]);

  const liquidityValue = useMemo((): string => {
    if (isLoadingPool) return "$0";

    return formatUsdNumber(
      Math.round(Number(pool.tvl)).toString(),
      undefined,
      true,
    );
  }, [isLoadingPool, pool.tvl]);

  const volumeValue = useMemo((): string => {
    if (isLoadingPool) return "$0";

    return formatUsdNumber(
      Math.round(Number(pool.volume24h)).toString(),
      undefined,
      true,
    );
  }, [isLoadingPool, pool.volume24h]);

  const feeChangedStr = useMemo((): string => {
    if (isLoadingPool) return "$0";

    return `$${convertToKMB(`${Math.round(Number(pool.feeUsd24h))}`, {
      maximumFractionDigits: 2,
    })}`;
  }, [isLoadingPool, pool.feeUsd24h]);

  const rewardTokens = useMemo(() => {
    return [
      ...new Set(
        pool?.rewardTokens?.map(item => getGnotPath(item).logoURI) || [],
      ),
    ];
  }, [pool.rewardTokens]);

  const feeApr = useMemo(() => {
    if (isLoadingPool) return "-";

    return numberToRate(pool.feeApr);
  }, [isLoadingPool, pool.feeApr]);

  const stakingApr = useMemo(() => {
    if (isLoadingPool) return "-";

    return numberToRate(pool.stakingApr);
  }, [isLoadingPool, pool.stakingApr]);

  if (!tokenA || !tokenB || !tokenARevert || !tokenBRevert) {
    return <></>;
  }

  function renderPositionInfo() {
    return <div className="one-click-info">
      <div>
        <div className="label">TVL</div>
        <div className="value">{liquidityValue}</div>
      </div>
      <div>
        <div className="label">Volume 24h</div>
        <div className="value">{volumeValue}</div>
      </div>
      <div>
        <div className="label">Fee 24h</div>
        <div className="value">{feeChangedStr}</div>
      </div>
      <div>
        <div className="label">Fee APR</div>
        <div className="value">
          {!isLoadingPool && <DoubleLogo
            left={tokenARevert?.logoURI || ""}
            right={tokenBRevert?.logoURI || ""}
            size={24}
            leftSymbol={tokenARevert?.symbol || ""}
            rightSymbol={tokenBRevert?.symbol || ""}
          />}
          {feeApr}
        </div>
      </div>
      <div>
        <div className="label">Staking APR</div>
        <div className="value">
          <OverlapLogo logos={rewardTokens} size={24} />
          {stakingApr}
        </div>
      </div>
    </div>;
  }


  return (
    <OneClickStakingWrapper>
      <div className="token-pair">
        <DoubleLogo
          left={tokenARevert?.logoURI || ""}
          right={tokenBRevert?.logoURI || ""}
          size={24}
          leftSymbol={tokenARevert?.symbol || ""}
          rightSymbol={tokenBRevert?.symbol || ""}
        />
        <span className="token-name">{`${tokenARevert?.symbol}/${tokenBRevert?.symbol}`}</span>
      </div>
      {renderPositionInfo()}
      {(isStakedPositions || isUnstakedPositions) && !isLoadingPool && (
        <Divider />
      )}
      {
        isUnstakedPositions && !isLoadingPool && (
          <div className="unstake-info">
            <div className="title">
              <div className="label">My Unstaked Positions</div>
              <div className="value" onClick={handleClickGotoStaking}>
                Go to Staking <IconStrokeArrowRight />
              </div>
            </div>
            {unstakedPositions.map((item, index) => (
              <div className="content" key={index}>
                <div className="label">
                  {!isLoadingPool && (
                    <DoubleTokenLogo
                      left={tokenARevert}
                      right={tokenBRevert}
                      size={24}
                      fontSize={8}
                    />
                  )}
                  ID #{item.id}
                </div >
                <div className="value">
                  {toUnitFormat(item.positionUsdValue, true, true)}
                </div>
              </div >
            ))}
          </div >
        )}

      {
        isStakedPositions && !isLoadingPool && (
          <div className="stake-info">
            <div className="title">
              <div className="label">My Staked Positions</div>
              {!isUnstakedPositions && (
                <div className="value" onClick={handleClickGotoStaking}>
                  Go to Staking <IconStrokeArrowRight />
                </div>
              )}
            </div>
            {stakedPositions.map((item, index) => (
              <div className="content" key={index}>
                <div className="label">
                  <DoubleTokenLogo
                    left={tokenARevert}
                    right={tokenBRevert}
                    size={24}
                    fontSize={8}
                  />
                  ID #{item.id}
                </div>
                <div className="value">
                  {toUnitFormat(item.positionUsdValue, true, true)}
                </div>
              </div>
            ))}
          </div>
        )
      }
    </OneClickStakingWrapper >
  );
};

export default OneClickStaking;
