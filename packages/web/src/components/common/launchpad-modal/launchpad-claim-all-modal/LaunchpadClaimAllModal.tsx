import React from "react";

import {
  LaunchpadParticipationModel,
  LaunchpadPoolModel,
} from "@models/launchpad";
import { useTokenData } from "@hooks/token/use-token-data";
import { type TierType } from "@utils/launchpad-get-tier-number";

import { LaunchpadClaimAllModalWrapper } from "./LaunchpadClaimAllModal.styles";
import IconClose from "@components/common/icons/IconCancel";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import LaunchpadPoolTierChip from "@views/launchpad/components/launchpad-pool-tier-chip/LaunchpadPoolTierChip";
import { useLaunchpadHandler } from "@hooks/launchpad/use-launchpad-handler";

interface LaunchpadClaimAllModalProps {
  data: LaunchpadParticipationModel[];
  poolInfos: LaunchpadPoolModel[];

  refetch: () => Promise<void>;
  close: () => void;
}

const LaunchpadClaimAllModal = ({
  data,
  poolInfos,
  refetch,
  close,
}: LaunchpadClaimAllModalProps) => {
  const { claimAll } = useLaunchpadHandler();
  const { getTokenSymbol } = useTokenData();

  const rewardTokenSymbol = React.useMemo(() => {
    if (data.length === 0) return null;

    const firstPool = data[0];
    if (!firstPool.rewardTokenPath) return null;

    return getTokenSymbol(firstPool.rewardTokenPath);
  }, [data, poolInfos, getTokenSymbol]);

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
  }, [data]);

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
          {Object.entries(summaryData).map(([poolTier, data]) => (
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
                  <div className="value">
                    {data.claimable} {rewardTokenSymbol}
                  </div>
                </div>
                {data.status === "ENDED" && (
                  <div className="data-row">
                    <div className="key">Deposit Amount</div>
                    <div className="value">{data.depositAmount}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
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
