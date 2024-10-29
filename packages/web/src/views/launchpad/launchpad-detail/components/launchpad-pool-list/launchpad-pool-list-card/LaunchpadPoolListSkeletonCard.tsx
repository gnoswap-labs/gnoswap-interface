import { getTierDuration, TierType } from "@utils/launchpad-get-tier-number";
import { getClaimableDays } from "@utils/launchpad-get-claimable";

import { CardWrapper } from "./LaunchpadPoolListCard.styles";
import { Divider } from "@components/common/select-token/SelectToken.styles";
import LaunchpadPoolTierChip from "@views/launchpad/components/launchpad-pool-tier-chip/LaunchpadPoolTierChip";
import { pulseSkeletonStyle } from "@constants/skeleton.constant";

export const LaunchpadPoolListSkeletonCard = ({ idx }: { idx: number }) => {
  const data = [
    { poolTier: "TIER180", status: "ONGOING", claimableDays: 14 },
    { poolTier: "TIER90", status: "ONGOING", claimableDays: 7 },
    { poolTier: "TIER30", status: "ONGOING", claimableDays: 3 },
  ];

  return (
    <CardWrapper>
      <div className="card-header">
        <div className="card-header-title">
          <span className="title">Pool {idx + 1}</span>
          <LaunchpadPoolTierChip poolTier={data[idx].poolTier as TierType} />
        </div>
      </div>

      <div className="card-description">
        Staking for {getTierDuration(data[idx].poolTier as TierType)}. <br />
        Rewards claimable starting <br />
        after {getClaimableDays(data[idx].poolTier)} days.
      </div>

      <Divider />

      <div className="data">
        <div className="key">Participants</div>
        <div css={pulseSkeletonStyle({ w: 103, h: 18 })} />
      </div>
      <div className="data">
        <div className="key">APR</div>
        <div css={pulseSkeletonStyle({ w: 103, h: 18 })} />
      </div>
      <div className="data">
        <div className="key">Total Deposits</div>
        <div css={pulseSkeletonStyle({ w: 103, h: 24 })} />
      </div>
      <div className="data">
        <div className="key">Token Distributed</div>
        <div css={pulseSkeletonStyle({ w: 103, h: 24 })} />
      </div>
    </CardWrapper>
  );
};
