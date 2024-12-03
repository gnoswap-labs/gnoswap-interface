import React from "react";
import BigNumber from "bignumber.js";
import { useTranslation } from "react-i18next";

import { LaunchpadParticipationModel } from "@models/launchpad";
import { type TierType } from "@utils/launchpad-get-tier-number";
import withLocalModal from "@components/hoc/with-local-modal";

import { LaunchpadClaimAllModalWrapper } from "./LaunchpadClaimAllModal.styles";
import IconClose from "@components/common/icons/IconCancel";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import LaunchpadPoolTierChip from "src/layouts/launchpad/components/launchpad-pool-tier-chip/LaunchpadPoolTierChip";
import LaunchpadClaimAmountField from "./launchpad-claim-amount-field/LaunchpadClaimAmountField";
import { ProjectRewardInfoModel } from "src/layouts/launchpad/launchpad-detail/LaunchpadDetail";

interface LaunchpadClaimAllModalProps {
  data: LaunchpadParticipationModel[];
  rewardInfo: ProjectRewardInfoModel;
  isWalletConnected: boolean;

  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (participationInfos: LaunchpadParticipationModel[]) => void;
}

const LaunchpadClaimAllModal = ({
  data,
  rewardInfo,
  isWalletConnected,
  onSubmit,
  setIsOpen,
}: LaunchpadClaimAllModalProps) => {
  const { t } = useTranslation();

  const Modal = React.useMemo(() => withLocalModal(LaunchpadClaimAllModalWrapper, setIsOpen), [setIsOpen]);

  const filteredClaimableData = React.useMemo(() => {
    return data.filter(item => {
      const currentTime = new Date();
      const claimableTime = new Date(item.claimableTime);
      return currentTime > claimableTime;
    });
  }, [data]);

  const confirm = React.useCallback(() => {
    setIsOpen(false);

    if (!isWalletConnected) {
      return;
    }

    onSubmit(data);
  }, [data, isWalletConnected, setIsOpen, onSubmit]);

  const isEndTime = (item: { endTime: string }): boolean => {
    const now = new Date();
    const endTime = new Date(item.endTime);

    return endTime <= now;
  };

  return (
    <Modal>
      <div className="modal-body">
        <div className="header">
          <h6>{t("Launchpad:modal.claimAll.title")}</h6>
          <div className="close-wrap" onClick={() => setIsOpen(false)}>
            <IconClose className="close-icon" />
          </div>
        </div>

        <div className="content-wrapper">
          <div className="content">
            {filteredClaimableData.map((item, idx) => {
              const endTimeReached = isEndTime(item);

              const isClaimedReward = BigNumber(item.claimableRewardAmount).isLessThan(0.01);
              const isClaimedDeposit = BigNumber(item.claimableRewardAmount).isLessThan(0.01);
              const isClaimed = isClaimedReward && isClaimedDeposit;

              if (isClaimed) return <React.Fragment />;

              return (
                <div className="data" key={item.id}>
                  <div className="data-box">
                    <div className="data-row">
                      <div className="key">{t("Launchpad:modal.claimAll.col.pool")}</div>
                      <div className="value">
                        #{idx + 1} <LaunchpadPoolTierChip poolTier={item.poolTier as TierType} />
                      </div>
                    </div>
                    <div className="data-row">
                      <div className="key">{t("Launchpad:modal.claimAll.col.claimable")}</div>
                      <LaunchpadClaimAmountField
                        amount={item.claimableRewardAmount}
                        rewardInfo={rewardInfo}
                        type={"CLAIMABLE"}
                      />
                    </div>
                    {endTimeReached && (
                      <div className="data-row">
                        <div className="key">{t("Launchpad:modal.claimAll.col.depositAmount")}</div>
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
        </div>

        <div className="footer">
          <ConfirmButton text={t("Launchpad:modal.confirm.button")} onClick={confirm} />
        </div>
      </div>
    </Modal>
  );
};

const ConfirmButton = ({ text, onClick }: { text: string; onClick: () => void }) => {
  const defaultStyle = {
    fullWidth: true,
    hierarchy: ButtonHierarchy.Primary,
  };
  return <Button text={text} style={defaultStyle} onClick={onClick} />;
};

export default LaunchpadClaimAllModal;
