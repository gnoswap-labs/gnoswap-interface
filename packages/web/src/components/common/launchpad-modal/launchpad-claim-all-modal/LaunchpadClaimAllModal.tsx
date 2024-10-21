import React from "react";

import {
  LaunchpadParticipationModel,
  LaunchpadPoolModel,
} from "@models/launchpad";
import { type TierType } from "@utils/launchpad-get-tier-number";

import { LaunchpadClaimAllModalWrapper } from "./LaunchpadClaimAllModal.styles";
import IconClose from "@components/common/icons/IconCancel";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import LaunchpadPoolTierChip from "@views/launchpad/components/launchpad-pool-tier-chip/LaunchpadPoolTierChip";
import { useLaunchpadHandler } from "@hooks/launchpad/use-launchpad-handler";
import LaunchpadClaimAmountField from "./launchpad-claim-amount-field/LaunchpadClaimAmountField";
import { ProjectRewardInfoModel } from "@views/launchpad/launchpad-detail/LaunchpadDetail";

interface LaunchpadClaimAllModalProps {
  data: LaunchpadParticipationModel[];
  poolInfos: LaunchpadPoolModel[];
  rewardInfo: ProjectRewardInfoModel;

  refetch: () => Promise<void>;
  close: () => void;
}

const LaunchpadClaimAllModal = ({
  data,
  poolInfos,
  rewardInfo,
  refetch,
  close,
}: LaunchpadClaimAllModalProps) => {
  const { claimAll } = useLaunchpadHandler();

  const summaryData = React.useMemo(() => {
    const summary: {
      [key: string]: {
        claimable: number;
        depositAmount: number;
        status: string;
      };
    } = {};

    data.forEach(participation => {
      const poolInfo = poolInfos.find(
        pool => pool.projectPoolId === participation.projectPoolId,
      );
      if (poolInfo) {
        if (!summary[poolInfo.poolTier]) {
          summary[poolInfo.poolTier] = {
            claimable: 0,
            depositAmount: 0,
            status: participation.status,
          };
        }
        summary[poolInfo.poolTier].claimable +=
          participation.claimableRewardAmount;
        summary[poolInfo.poolTier].depositAmount += participation.depositAmount;
      }
    });

    return summary;
  }, [data, poolInfos]);

  const handleClickClaimAll = React.useCallback(() => {
    claimAll(data, async () => {
      refetch();
    });
  }, [data, claimAll, refetch]);

  return (
    <LaunchpadClaimAllModalWrapper>
      <div className="modal-body">
        <div className="header">
          <h6>Confirm Claim All</h6>
          <div className="close-wrap" onClick={close}>
            <IconClose className="close-icon" />
          </div>
        </div>

        <div className="content">
          {Object.entries(summaryData).map(([poolTier, data]) => {
            return (
              <div className="data" key={poolTier}>
                <div className="data-box">
                  <div className="data-row">
                    <div className="key">Pool</div>
                    <div className="value">
                      <LaunchpadPoolTierChip poolTier={poolTier as TierType} />
                    </div>
                  </div>
                  <div className="data-row">
                    <div className="key">Claimable</div>
                    <LaunchpadClaimAmountField
                      amount={data.claimable}
                      rewardInfo={rewardInfo}
                      type={"CLAIMABLE"}
                    />
                  </div>
                  {data.status === "ENDED" && (
                    <div className="data-row">
                      <div className="key">Deposit Amount</div>
                      <LaunchpadClaimAmountField
                        amount={data.depositAmount}
                        rewardInfo={rewardInfo}
                        type={"DEPOSIT"}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="footer">
          <ConfirmButton onClick={handleClickClaimAll} />
        </div>
      </div>
    </LaunchpadClaimAllModalWrapper>
  );
};

const ConfirmButton = ({ onClick }: { onClick: () => void }) => {
  const defaultStyle = {
    fullWidth: true,
    hierarchy: ButtonHierarchy.Primary,
  };
  return <Button text="Confirm" style={defaultStyle} onClick={onClick} />;
};

export default LaunchpadClaimAllModal;
