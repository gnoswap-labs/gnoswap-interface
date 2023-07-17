import React from "react";
import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import DoubleLogo from "@components/common/double-logo/DoubleLogo";
import IconStaking from "@components/common/icons/IconStaking";
import RangeBadge from "@components/common/range-badge/RangeBadge";
import { STAKED_OPTION } from "@constants/option.constant";
import { tokenPairSymbolToOneCharacter } from "@utils/string-utils";
import { wrapper } from "./MyLiquidityDetailsCard.styles";

interface MyLiquidityDetailsCardProps {
  item: any;
}

const MyLiquidityDetailsCard: React.FC<MyLiquidityDetailsCardProps> = ({
  item,
}) => {
  const {
    tokenPair,
    rangeType,
    stakeType,
    minPriceAmount,
    maxPriceAmount,
    balance,
    rewards,
    apr,
  } = item;
  return (
    <div css={wrapper(stakeType === STAKED_OPTION.STAKED)}>
      <div className="pair-wrap">
        <div className="token-info">
          <DoubleLogo
            left={tokenPair.token0.tokenLogo}
            right={tokenPair.token1.tokenLogo}
          />
          <span className="pair-symbol">
            {tokenPairSymbolToOneCharacter(tokenPair)}
          </span>
          {stakeType === STAKED_OPTION.STAKED && (
            <Badge
              type={BADGE_TYPE.PRIMARY}
              leftIcon={<IconStaking />}
              text={stakeType}
            />
          )}
        </div>
        <RangeBadge status={rangeType} />
      </div>
      <p className="min-max-price">
        <span>Min&nbsp;</span>
        {minPriceAmount}
        <span>&nbsp;&harr;&nbsp;Max&nbsp;</span>
        {maxPriceAmount}
      </p>
      <div className="content-section">
        <section>
          <h4>Balance</h4>
          <span className="content-value">{balance}</span>
        </section>
        <section>
          <h4>Total Rewards</h4>
          <span className="content-value">{rewards}</span>
        </section>
        <section>
          <h4>Estimated APR</h4>
          <span className="content-value">{apr}</span>
        </section>
      </div>
    </div>
  );
};

export default MyLiquidityDetailsCard;
