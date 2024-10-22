import React from "react";
import Image from "next/image";

import { LaunchpadParticipationModel } from "@models/launchpad";
import { ParticipateButtonProps } from "../LaunchpadMyParticipation";
import { LAUNCHPAD_DEFAULT_DEPOSIT_TOKEN } from "@common/values/token-constant";
import { ProjectRewardInfoModel } from "@views/launchpad/launchpad-detail/LaunchpadDetail";
import { getDateUtcToLocal } from "@common/utils/date-util";

import { Divider } from "@components/common/divider/divider";
import IconArrowUp from "@components/common/icons/IconArrowUp";
import IconArrowDown from "@components/common/icons/IconArrowDown";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import { MyParticipationBoxWrapper } from "./LaunchpadMyParticipationBox.styles";
import LaunchpadPoolTierChip from "@views/launchpad/components/launchpad-pool-tier-chip/LaunchpadPoolTierChip";
import MissingLogo from "@components/common/missing-logo/MissingLogo";

interface LaunchpadMyParticipationBoxProps {
  item: LaunchpadParticipationModel;
  idx: number;
  rewardInfo: ProjectRewardInfoModel;

  handleClickClaim: (data: LaunchpadParticipationModel) => void;
}

const LaunchpadMyParticipationBox = ({
  item,
  idx,
  rewardInfo,
  handleClickClaim,
}: LaunchpadMyParticipationBoxProps) => {
  const [openedSelector, setOpenedSelector] = React.useState(false);
  return (
    <MyParticipationBoxWrapper key={item.id}>
      <div className="my-participation-box-header">
        <div className="participation-box-index">#{idx}</div>
        <LaunchpadPoolTierChip poolTier={item.poolTier} />
      </div>

      <div className="participation-box-data-wrapper">
        <div className="participation-box-data">
          <div className="participation-box-data-key">Deposit Amounts</div>
          <div className="participation-box-data-value">
            <Image
              src="/gns.svg"
              width={24}
              height={24}
              alt="GNS symbol image"
            />
            {item.depositAmount} {LAUNCHPAD_DEFAULT_DEPOSIT_TOKEN}
          </div>
        </div>
        <div className="participation-box-data">
          <div className="participation-box-data-key">APR</div>
          <div className="participation-box-data-value">
            {item.depositAPR || "-"}
          </div>
        </div>
        <div className="participation-box-data">
          <div className="participation-box-data-key">Claimable</div>
          <div className="participation-box-data-value">
            <MissingLogo
              url={rewardInfo?.rewardTokenLogoUrl}
              symbol={rewardInfo?.rewardTokenSymbol}
              width={24}
              mobileWidth={24}
            />
            <>
              {item.claimableRewardAmount} {rewardInfo?.rewardTokenSymbol}
            </>
          </div>
        </div>
        {openedSelector && (
          <>
            <div className="participation-box-data">
              <div className="participation-box-data-key">Claimable Date</div>
              <div className="participation-box-data-value">
                {getDateUtcToLocal(item.claimableTime).value}
              </div>
            </div>
            <div className="participation-box-data">
              <div className="participation-box-data-key">Claimed</div>
              <div className="participation-box-data-value">
                <MissingLogo
                  url={rewardInfo?.rewardTokenLogoUrl}
                  symbol={rewardInfo?.rewardTokenSymbol}
                  width={24}
                  mobileWidth={24}
                />
                <>
                  {item.claimedRewardAmount} {rewardInfo?.rewardTokenSymbol}
                </>
              </div>
            </div>
            <div className="participation-box-data">
              <div className="participation-box-data-key">End Date</div>
              <div className="participation-box-data-value">
                {getDateUtcToLocal(item.endTime).value}
              </div>
            </div>
            <div className="participation-box-button-wrapper">
              <ClaimButton onClick={() => handleClickClaim(item)} />
            </div>
          </>
        )}
      </div>

      <Divider />

      <div
        className="box-accordion-button-wrapper"
        onClick={() => setOpenedSelector(prev => !prev)}
      >
        <div className="title">
          <div>Details</div>
          <div className="icon-wrapper">
            {openedSelector ? <IconArrowUp /> : <IconArrowDown />}
          </div>
        </div>
      </div>
    </MyParticipationBoxWrapper>
  );
};

export const ClaimButton: React.FC<ParticipateButtonProps> = ({ onClick }) => {
  const claimDefaultStyle = {
    fullWidth: true,
    hierarchy: ButtonHierarchy.Primary,
  };

  return <Button text="Claim" style={claimDefaultStyle} onClick={onClick} />;
};

export default LaunchpadMyParticipationBox;
