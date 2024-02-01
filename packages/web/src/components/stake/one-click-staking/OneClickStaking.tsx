import { Divider, OneClickStakingWrapper } from "./OneClickStaking.styles";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconStrokeArrowRight from "@components/common/icons/IconStrokeArrowRight";
import { useAtom } from "jotai";
import { SwapState } from "@states/index";
import DoubleTokenLogo from "@components/common/double-token-logo/DoubleTokenLogo";
import { PositionModel } from "@models/position/position-model";
import { useMemo } from "react";
import { convertToKMB } from "@utils/stake-position-utils";
import { useGnotToGnot } from "@hooks/token/use-gnot-wugnot";
import MissingLogo from "@components/common/missing-logo/MissingLogo";
interface Props {
  stakedPositions: PositionModel[];
  unstakedPositions: PositionModel[];
  handleClickGotoStaking: () => void;
}

const OneClickStaking: React.FC<Props> = ({
  stakedPositions,
  unstakedPositions,
  handleClickGotoStaking
}) => {
  const [swapValue] = useAtom(SwapState.swap);
  const { getGnotPath } = useGnotToGnot();
  const { tokenA: tokenAInfo = null, tokenB: tokenBInfo = null } = swapValue;
  const tokenA = tokenAInfo ? {
    ...tokenAInfo,
    logoURI: getGnotPath(tokenAInfo).logoURI,
    path: getGnotPath(tokenAInfo).path,
    name: getGnotPath(tokenAInfo).name,
    symbol: getGnotPath(tokenAInfo).symbol,
  } : null;

  const tokenB = tokenBInfo ? {
    ...tokenBInfo,
    logoURI: getGnotPath(tokenBInfo).logoURI,
    path: getGnotPath(tokenBInfo).path,
    name: getGnotPath(tokenBInfo).name,
    symbol: getGnotPath(tokenBInfo).symbol,
  } : null;

  const isStakedPositions = useMemo(() => {
    return stakedPositions.length > 0;
  }, [stakedPositions]);

  const isUnstakedPositions = useMemo(() => {
    return unstakedPositions.length > 0;
  }, [unstakedPositions]);

  if (!tokenA || !tokenB) {
    return <></>;
  }

  return (
    <OneClickStakingWrapper>
      <div className="token-pair">
        <DoubleLogo
          left={tokenA?.logoURI || ""}
          right={tokenB?.logoURI || ""}
          size={24}
          leftSymbol={tokenA?.symbol || ""}
          rightSymbol={tokenB?.symbol || ""}
        />
        <span className="token-name">{`${tokenA.symbol}/${tokenB.symbol}`}</span>
      </div>
      <div className="one-click-info">
        <div>
          <div className="label">TVL</div>
          <div className="value">-</div>
        </div>
        <div>
          <div className="label">Volume 24h</div>
          <div className="value">-</div>
        </div>
        <div>
          <div className="label">Fee 24h</div>
          <div className="value">-</div>
        </div>
        <div>
          <div className="label">Fee APR</div>
          <div className="value">
            <DoubleLogo
              left={tokenA?.logoURI || ""}
              right={tokenB?.logoURI || ""}
              size={24}
              leftSymbol={tokenA?.symbol || ""}
              rightSymbol={tokenB?.symbol || ""}
            />
            14.45%
          </div>
        </div>
        <div>
          <div className="label">Staking APR</div>
          <div className="value">
            <MissingLogo
              symbol={tokenA?.symbol || ""}
              url={tokenA?.logoURI || ""}
              width={24}
              mobileWidth={24}
            />
            14.45%
          </div>
        </div>
      </div>
      {(isStakedPositions || isUnstakedPositions) && <Divider />}
      {isUnstakedPositions && (
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
                <DoubleTokenLogo
                  left={tokenA}
                  right={tokenB}
                  size={24}
                  fontSize={8}
                />
                ID #{item.id}
              </div>
              <div className="value">${convertToKMB(item.positionUsdValue)}</div>
            </div>
          ))}
        </div>
      )}

      {isStakedPositions && (
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
                  left={tokenA}
                  right={tokenB}
                  size={24}
                  fontSize={8}
                />
                ID #{item.id}
              </div>
              <div className="value">${convertToKMB(item.positionUsdValue)}</div>
            </div>
          ))}
        </div>
      )}
    </OneClickStakingWrapper>
  );
};

export default OneClickStaking;
