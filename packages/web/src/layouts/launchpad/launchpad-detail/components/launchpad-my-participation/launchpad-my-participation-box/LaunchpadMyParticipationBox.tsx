import React from "react";
import Image from "next/image";
import { useTranslation } from "next-i18next";

import { LaunchpadParticipationModel } from "@models/launchpad";
import { ParticipateButtonProps } from "../LaunchpadMyParticipation";
import { GNS_TOKEN, LAUNCHPAD_DEFAULT_DEPOSIT_TOKEN } from "@common/values/token-constant";
import { ProjectRewardInfoModel } from "@layouts/launchpad/launchpad-detail/LaunchpadDetail";
import { getDateUtcToLocal } from "@common/utils/date-util";
import { rawToDisplayAmount, toNumberFormat } from "@utils/number-utils";
import { formatRate } from "@utils/new-number-utils";
import { formatClaimableTime } from "@utils/launchpad-format-claimable-time";
import {
  isLaunchpadParticipationClaimable,
  isLaunchpadParticipationClaimed,
} from "@utils/launchpad-claimable-participation";

import { Divider } from "@components/common/divider/divider";
import IconArrowUp from "@components/common/icons/IconArrowUp";
import IconArrowDown from "@components/common/icons/IconArrowDown";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import { MyParticipationBoxWrapper } from "./LaunchpadMyParticipationBox.styles";
import LaunchpadPoolTierChip from "@layouts/launchpad/components/launchpad-pool-tier-chip/LaunchpadPoolTierChip";
import MissingLogo from "@components/common/missing-logo/MissingLogo";

interface LaunchpadMyParticipationBoxProps {
  item: LaunchpadParticipationModel;
  idx: number;
  rewardInfo: ProjectRewardInfoModel;

  handleClickClaim: (data: LaunchpadParticipationModel) => void;
}

const LaunchpadMyParticipationBox = ({ item, idx, rewardInfo, handleClickClaim }: LaunchpadMyParticipationBoxProps) => {
  const { t } = useTranslation();

  const [openedSelector, setOpenedSelector] = React.useState(false);

  const displayParticipationModel: LaunchpadParticipationModel = React.useMemo(() => {
    return {
      ...item,
      depositAmount: rawToDisplayAmount(item.depositAmount, GNS_TOKEN.decimals),
      claimableRewardAmount: rawToDisplayAmount(item.claimableRewardAmount, rewardInfo.rewardTokenDecimals),
      claimedRewardAmount: rawToDisplayAmount(item.claimedRewardAmount, rewardInfo.rewardTokenDecimals),
    };
  }, [item, rewardInfo.rewardTokenDecimals]);

  const aprStr = item?.depositAPR ? (
    <>
      {Number(item.depositAPR) > 100 && "✨"}
      {formatRate(item.depositAPR)} APR
    </>
  ) : (
    "-"
  );

  const isClaimable = React.useMemo(() => {
    return isLaunchpadParticipationClaimable(displayParticipationModel);
  }, [displayParticipationModel]);

  const isClaimed = React.useMemo(() => {
    return isLaunchpadParticipationClaimed(displayParticipationModel);
  }, [displayParticipationModel]);

  return (
    <MyParticipationBoxWrapper key={displayParticipationModel.id}>
      <div className="my-participation-box-header">
        <div className="participation-box-index">#{idx}</div>
        <LaunchpadPoolTierChip poolTier={displayParticipationModel.poolTier} />
      </div>

      <div className="participation-box-data-wrapper">
        <div className="participation-box-data">
          <div className="participation-box-data-key">{t("Launchpad:myParticipation.col.depositAmounts")}</div>
          <div className="participation-box-data-value">
            <Image src="/gns.svg" width={24} height={24} alt="GNS symbol image" />
            {toNumberFormat(displayParticipationModel.depositAmount, 2)} {LAUNCHPAD_DEFAULT_DEPOSIT_TOKEN}
          </div>
        </div>
        <div className="participation-box-data">
          <div className="participation-box-data-key">{t("Launchpad:myParticipation.col.apr")}</div>
          <div className="participation-box-data-value">{aprStr}</div>
        </div>
        <div className="participation-box-data">
          <div className="participation-box-data-key">{t("Launchpad:myParticipation.col.claimable")}</div>
          <div className="participation-box-data-value">
            <MissingLogo
              url={rewardInfo?.rewardTokenLogoURL}
              symbol={rewardInfo?.rewardTokenSymbol}
              width={24}
              mobileWidth={24}
            />
            <>
              {isClaimed ? 0 : toNumberFormat(displayParticipationModel.claimableRewardAmount, 6)}{" "}
              {rewardInfo?.rewardTokenSymbol}
            </>
          </div>
        </div>
        {openedSelector && (
          <>
            <div className="participation-box-data">
              <div className="participation-box-data-key">{t("Launchpad:myParticipation.col.claimableDate")}</div>
              <div className="participation-box-data-value">
                {formatClaimableTime(displayParticipationModel.claimableTime, t)}
              </div>
            </div>
            <div className="participation-box-data">
              <div className="participation-box-data-key">{t("Launchpad:myParticipation.col.claimed")}</div>
              <div className="participation-box-data-value">
                <MissingLogo
                  url={rewardInfo?.rewardTokenLogoURL}
                  symbol={rewardInfo?.rewardTokenSymbol}
                  width={24}
                  mobileWidth={24}
                />
                <>
                  {toNumberFormat(displayParticipationModel.claimedRewardAmount, 6)} {rewardInfo?.rewardTokenSymbol}
                </>
              </div>
            </div>
            <div className="participation-box-data">
              <div className="participation-box-data-key">{t("Launchpad:myParticipation.col.endDate")}</div>
              <div className="participation-box-data-value">
                {getDateUtcToLocal(displayParticipationModel.endTime).value}
              </div>
            </div>
            <div className="participation-box-button-wrapper">
              <ClaimButton
                text={t("Launchpad:common.button.claim")}
                onClick={() => isClaimable && handleClickClaim(displayParticipationModel)}
                disabled={!isClaimable || isClaimed}
              />
            </div>
          </>
        )}
      </div>

      <Divider />

      <div className="box-accordion-button-wrapper" onClick={() => setOpenedSelector(prev => !prev)}>
        <div className="title">
          <div>{t("Launchpad:common.button.details")}</div>
          <div className="icon-wrapper">{openedSelector ? <IconArrowUp /> : <IconArrowDown />}</div>
        </div>
      </div>
    </MyParticipationBoxWrapper>
  );
};

export const ClaimButton: React.FC<ParticipateButtonProps> = ({ text, onClick, disabled }) => {
  const claimDefaultStyle = {
    fullWidth: true,
    hierarchy: ButtonHierarchy.Primary,
  };

  return <Button text={text} style={claimDefaultStyle} onClick={onClick} disabled={disabled} />;
};

export default LaunchpadMyParticipationBox;
