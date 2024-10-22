import React from "react";

import { LaunchpadParticipationModel } from "@models/launchpad";
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
  rewardInfo: ProjectRewardInfoModel;

  refetch: () => Promise<void>;
  close: () => void;
}

const LaunchpadClaimAllModal = ({
  data,
  rewardInfo,
  refetch,
  close,
}: LaunchpadClaimAllModalProps) => {
  const { claimAll } = useLaunchpadHandler();

  const filteredClaimableData = React.useMemo(() => {
    return data.filter(item => {
      const currentTime = new Date();
      const claimableTime = new Date(item.claimableTime);
      return currentTime > claimableTime;
    });
  }, [data]);

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
          {filteredClaimableData.map((item, idx) => {
            return (
              <div className="data" key={item.id}>
                <div className="data-box">
                  <div className="data-row">
                    <div className="key">Pool</div>
                    <div className="value">
                      #{idx + 1}{" "}
                      <LaunchpadPoolTierChip
                        poolTier={item.poolTier as TierType}
                      />
                    </div>
                  </div>
                  <div className="data-row">
                    <div className="key">Claimable</div>
                    <LaunchpadClaimAmountField
                      amount={item.claimableRewardAmount}
                      rewardInfo={rewardInfo}
                      type={"CLAIMABLE"}
                    />
                  </div>
                  {item.status === "ENDED" && (
                    <div className="data-row">
                      <div className="key">Deposit Amount</div>
                      <LaunchpadClaimAmountField
                        amount={item.depositAmount}
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
