import { Divider, OneClickStakingWrapper } from "./OneClickStaking.styles";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconStrokeArrowRight from "@components/common/icons/IconStrokeArrowRight";
import { useAtom } from "jotai";
import { SwapState } from "@states/index";
import { PositionModel } from "@models/position/position-model";
import { useMemo, useState, useEffect } from "react";
import { formatUsdNumber } from "@utils/stake-position-utils";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import { PoolDetailModel } from "@models/pool/pool-detail-model";
import { TokenModel } from "@models/token/token-model";
import IconStar from "@components/common/icons/IconStar";
import OverlapTokenLogo from "@components/common/overlap-token-logo/OverlapTokenLogo";
import { formatOtherPrice, formatRate } from "@utils/new-number-utils";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

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
    if (isLoadingPool || !pool.tvl) return "-";

    return formatUsdNumber(
      Math.round(Number(pool.tvl)).toString(),
      undefined,
      true,
    );
  }, [isLoadingPool, pool.tvl]);

  const volumeValue = useMemo((): string => {
    if (isLoadingPool || !pool.volume24h) return "-";

    return formatUsdNumber(
      Math.round(Number(pool.volume24h)).toString(),
      undefined,
      true,
    );
  }, [isLoadingPool, pool.volume24h]);

  const feeChangedStr = useMemo((): string => {
    if (isLoadingPool) return "-";

    return formatOtherPrice(pool.feeUsd24h);
  }, [isLoadingPool, pool.feeUsd24h]);

  const rewardTokens = useMemo(() => {
    return pool?.rewardTokens.reduce((acc, current) => {
      const existToken = acc.some(item => item.path === current.path);

      if (!existToken) {
        acc.push({
          ...current,
          logoURI: getGnotPath(current).logoURI,
          symbol: getGnotPath(current).symbol,
          path: getGnotPath(current).path,
        });
      }

      return acc;
    }, [] as TokenModel[]);
  }, [getGnotPath, pool?.rewardTokens]);

  const feeApr = useMemo(() => {
    if (isLoadingPool) return "-";

    return (
      <>
        {Number(pool.feeApr) > 100 && <IconStar size={20} />}
        {formatRate(pool.feeApr)}
      </>
    );
  }, [isLoadingPool, pool.feeApr]);

  const stakingApr = useMemo(() => {
    if (isLoadingPool) return "-";

    return (
      <>
        {Number(pool.stakingApr) > 100 && <IconStar size={20} />}{" "}
        {formatRate(pool.stakingApr)}
      </>
    );
  }, [isLoadingPool, pool.stakingApr]);

  if (!tokenA || !tokenB || !tokenARevert || !tokenBRevert) {
    return <></>;
  }

  function renderPositionInfo() {
    return (
      <div className="one-click-info">
        <div>
          <div className="label">{t("AddPosition:positionStat.label.tvl")}</div>
          <div className="value">{liquidityValue}</div>
        </div>
        <div>
          <div className="label">{t("AddPosition:positionStat.label.vol")}</div>
          <div className="value">{volumeValue}</div>
        </div>
        <div>
          <div className="label">
            {t("AddPosition:positionStat.label.fee24")}
          </div>
          <div className="value">{feeChangedStr}</div>
        </div>
        <div>
          <div className="label">
            {t("AddPosition:positionStat.label.feeApr")}
          </div>
          <div className="value">
            {!isLoadingPool && (
              <DoubleLogo
                left={tokenARevert?.logoURI || ""}
                right={tokenBRevert?.logoURI || ""}
                size={24}
                leftSymbol={tokenARevert?.symbol || ""}
                rightSymbol={tokenBRevert?.symbol || ""}
              />
            )}
            <span className="fee-apr-value">{feeApr}</span>
          </div>
        </div>
        <div>
          <div className="label">
            {t("AddPosition:positionStat.label.stakingApr")}
          </div>
          <div className="value">
            <OverlapTokenLogo tokens={rewardTokens} size={24} />
            <span className="staking-apr-value">{stakingApr}</span>
          </div>
        </div>
      </div>
    );
  }

  const renderUnstakedPosition = () => {
    return (
      isUnstakedPositions &&
      !isLoadingPool && (
        <div className="unstake-info">
          <div className="title">
            <div className="label">
              {t("AddPosition:positionStat.unstaked.title")}
            </div>
            <div className="value" onClick={handleClickGotoStaking}>
              {t("AddPosition:positionStat.unstaked.btn")}{" "}
              <IconStrokeArrowRight />
            </div>
          </div>
          {unstakedPositions.map((item, index) => (
            <div className="content" key={index}>
              <div className="label">
                {!isLoadingPool && (
                  <OverlapTokenLogo
                    tokens={[tokenARevert, tokenBRevert]}
                    size={24}
                  />
                )}
                ID #{item.id}
              </div>
              <div className="value">
                {formatOtherPrice(item.positionUsdValue)}
              </div>
            </div>
          ))}
        </div>
      )
    );
  };

  const renderStakedPosition = () => {
    return (
      isStakedPositions &&
      !isLoadingPool && (
        <div className="stake-info">
          <div className="title">
            <div className="label">
              {t("AddPosition:positionStat.staked.title")}
            </div>
            {!isUnstakedPositions && (
              <div className="value" onClick={handleClickGotoStaking}>
                {t("AddPosition:positionStat.staked.btn")}{" "}
                <IconStrokeArrowRight />
              </div>
            )}
          </div>
          {stakedPositions.map((item, index) => (
            <div className="content" key={index}>
              <div className="label">
                <OverlapTokenLogo
                  tokens={[tokenARevert, tokenBRevert]}
                  size={24}
                />
                ID #{item.id}
              </div>
              <div className="value">
                {formatOtherPrice(item.positionUsdValue)}
              </div>
            </div>
          ))}
        </div>
      )
    );
  };

  return (
    <OneClickStakingWrapper>
      <div className="token-pair">
        <OverlapTokenLogo tokens={[tokenARevert, tokenBRevert]} size={24} />
        <span className="token-name">{`${tokenARevert?.symbol}/${tokenBRevert?.symbol}`}</span>
      </div>
      {renderPositionInfo()}
      {(isStakedPositions || isUnstakedPositions) && !isLoadingPool && (
        <Divider />
      )}
      {renderUnstakedPosition()}
      {renderStakedPosition()}
    </OneClickStakingWrapper>
  );
};

export default OneClickStaking;
