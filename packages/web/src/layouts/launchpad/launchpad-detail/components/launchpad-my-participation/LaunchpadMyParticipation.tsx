import React from "react";
import { useTranslation } from "react-i18next";

import { GNS_TOKEN } from "@common/values/token-constant";
import { useLaunchpadHandler } from "@hooks/launchpad/data/use-launchpad-handler";
import { LaunchpadParticipationModel, LaunchpadPoolModel } from "@models/launchpad";
import { ProjectRewardInfoModel } from "../../LaunchpadDetail";

import { MyParticipationWrapper } from "./LaunchpadMyParticipation.styles";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import LaunchpadMyParticipationBox from "./launchpad-my-participation-box/LaunchpadMyParticipationBox";
import LaunchpadMyParticipationUnconnected from "./launchpad-my-participation-unconnected/LaunchpadMyParticipationUnconnected";
import LaunchpadMyParticipationNoData from "./launchpad-my-participation-no-data/LaunchpadMyParticipationNoData";
import { rawToDisplayAmount } from "@utils/number-utils";
import LaunchpadMyParticipationSkeleton from "./launchpad-my-participation-skeleton/LaunchpadMyParticipationSkeleton";
import LaunchpadClaimAllModal from "@components/common/launchpad-modal/launchpad-claim-all-modal/LaunchpadClaimAllModal";
import { isLaunchpadParticipationClaimable } from "@utils/launchpad-claimable-participation";

interface LaunchpadMyParticipationProps {
  poolInfos: LaunchpadPoolModel[];
  data: LaunchpadParticipationModel[];
  rewardInfo: ProjectRewardInfoModel;
  isWalletConnected: boolean;
  isSwitchNetwork: boolean;
  isFetched: boolean;
  isLoading: boolean;
  status: string;

  claimAll: (participationInfos: LaunchpadParticipationModel[]) => void;
  refetch: () => Promise<void>;
}

const LaunchpadMyParticipation = ({
  poolInfos,
  data,
  rewardInfo,
  isWalletConnected,
  isSwitchNetwork,
  isFetched,
  isLoading,
  status,
  claimAll,
  refetch,
}: LaunchpadMyParticipationProps) => {
  const { t } = useTranslation();

  // Modal
  const [isOpenClaimAllModal, setIsOpenClaimAllModal] = React.useState(false);

  const { claim } = useLaunchpadHandler();

  const handleClickClaim = React.useCallback(
    (data: LaunchpadParticipationModel) => {
      claim(data, async () => {
        await refetch();
      });
    },
    [claim, refetch],
  );

  const highestApr = React.useMemo(() => {
    return poolInfos.reduce((acc, current) => {
      if (Number(current.apr) > acc) {
        return Number(current.apr);
      }
      return acc;
    }, Number(poolInfos?.[0]?.apr ?? 0));
  }, [poolInfos]);

  const isShowClaimAllButton = React.useMemo(() => {
    return data.some(item => {
      return isLaunchpadParticipationClaimable({
        claimableTime: item.claimableTime,
        claimableRewardAmount: rawToDisplayAmount(item.claimableRewardAmount, rewardInfo.rewardTokenDecimals),
        depositAmount: rawToDisplayAmount(item.depositAmount, GNS_TOKEN.decimals),
        withdrawn: item.withdrawn,
      });
    });
  }, [data, rewardInfo.rewardTokenDecimals]);

  // Conditional rendering
  if (isLoading || !isFetched) {
    return (
      <MyParticipationWrapper>
        <div className="my-participation-header">
          <h3 className="my-participation-title">{t("Launchpad:myParticipation.title")}</h3>
        </div>
        <LaunchpadMyParticipationSkeleton />
      </MyParticipationWrapper>
    );
  }

  if (!isLoading && isFetched && status === "UPCOMING") {
    return <></>;
  }

  if (!isWalletConnected || isSwitchNetwork) {
    return (
      <MyParticipationWrapper>
        <div className="my-participation-header">
          <h3 className="my-participation-title">{t("Launchpad:myParticipation.title")}</h3>
        </div>
        <LaunchpadMyParticipationUnconnected />
      </MyParticipationWrapper>
    );
  }

  if (isWalletConnected && isFetched && data.length > 0) {
    return (
      <MyParticipationWrapper>
        <div className="my-participation-header">
          <h3 className="my-participation-title">{t("Launchpad:myParticipation.title")}</h3>
          {isShowClaimAllButton && (
            <div className="claim-all-button-wrapper">
              <ClaimAllButton
                text={t("Launchpad:common.button.claimAll")}
                onClick={() => {
                  setIsOpenClaimAllModal(true);
                }}
              />
            </div>
          )}
        </div>

        {data?.map((item, idx) => {
          return (
            <LaunchpadMyParticipationBox
              key={item.id}
              item={item}
              rewardInfo={rewardInfo}
              idx={idx + 1}
              handleClickClaim={handleClickClaim}
            />
          );
        })}
        {isOpenClaimAllModal && (
          <LaunchpadClaimAllModal
            data={data}
            rewardInfo={rewardInfo}
            isWalletConnected={isWalletConnected}
            setIsOpen={setIsOpenClaimAllModal}
            onSubmit={claimAll}
          />
        )}
      </MyParticipationWrapper>
    );
  }

  return (
    <MyParticipationWrapper>
      <div className="my-participation-header">
        <h3 className="my-participation-title">{t("Launchpad:myParticipation.title")}</h3>
      </div>
      <LaunchpadMyParticipationNoData highestApr={highestApr} />
    </MyParticipationWrapper>
  );
};

export interface ParticipateButtonProps {
  text: string;
  disabled?: boolean;

  onClick: () => void;
}

const ClaimAllButton: React.FC<ParticipateButtonProps> = ({ onClick, text }) => {
  const claimDefaultStyle = {
    fullWidth: true,
    hierarchy: ButtonHierarchy.Primary,
  };

  return <Button text={text} style={claimDefaultStyle} onClick={onClick} />;
};

export default LaunchpadMyParticipation;
