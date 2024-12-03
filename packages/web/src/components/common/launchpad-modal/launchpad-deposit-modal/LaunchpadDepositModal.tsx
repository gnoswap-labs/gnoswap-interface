import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Trans, useTranslation } from "react-i18next";

import { LaunchpadPoolModel } from "@models/launchpad";
import { ProjectRewardInfoModel } from "src/layouts/launchpad/launchpad-detail/LaunchpadDetail";
import { getTierNumber } from "@utils/launchpad-get-tier-number";
import { LAUNCHPAD_DEFAULT_DEPOSIT_TOKEN } from "@common/values/token-constant";
import { GNOT_TOKEN } from "@common/values/token-constant";
import withLocalModal from "@components/hoc/with-local-modal";

import { LaunchpadDepositModalWrapper } from "./LaunchpadDepositModal.styles";
import IconClose from "@components/common/icons/IconCancel";
import IconWarning from "../../icons/IconWarning";
import IconOpenLink from "../../icons/IconOpenLink";
import Button, { ButtonHierarchy } from "../../button/Button";
import LaunchpadPoolTierChip from "src/layouts/launchpad/components/launchpad-pool-tier-chip/LaunchpadPoolTierChip";
import { getDateUtcToLocal } from "@common/utils/date-util";
import MissingLogo from "@components/common/missing-logo/MissingLogo";

type LaunchpadPoolModelWithoutClaimableTime = Omit<LaunchpadPoolModel, "claimableTime">;

interface ExtendedPoolInfo extends LaunchpadPoolModelWithoutClaimableTime {
  claimableThreshold: number;
}

interface LaunchpadDepositModalProps {
  depositAmount: string;
  poolInfo?: ExtendedPoolInfo;
  rewardInfo: ProjectRewardInfoModel;
  projectPath: string;
  isWalletConnected: boolean;
  refetch: () => Promise<void>;
  onSubmit: (projectPoolId: string, depositAmount: string) => void;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const LaunchpadDepositModal = ({
  depositAmount,
  poolInfo,
  rewardInfo,
  projectPath,
  isWalletConnected,
  setIsOpen,
  onSubmit,
}: LaunchpadDepositModalProps) => {
  const { t } = useTranslation();

  const Modal = React.useMemo(() => withLocalModal(LaunchpadDepositModalWrapper, setIsOpen), [setIsOpen]);

  const now = new Date();
  const claimableTime = poolInfo?.claimableThreshold
    ? new Date(now.getTime() + Number(poolInfo.claimableThreshold) * 1000)
    : null;

  const poolDuration = getTierNumber(poolInfo?.poolTier);

  const confirm = React.useCallback(() => {
    setIsOpen(false);

    if (!isWalletConnected) {
      return;
    }

    onSubmit(`${projectPath}:${poolDuration}`, depositAmount);
  }, [projectPath, isWalletConnected, depositAmount, setIsOpen, poolDuration, onSubmit]);

  return (
    <Modal>
      <div className="modal-body">
        <div className="header">
          <h6>{t("Launchpad:modal.deposit.title")}</h6>
          <div className="close-wrap" onClick={() => setIsOpen(false)}>
            <IconClose className="close-icon" />
          </div>
        </div>
        <div className="content">
          <div className="data">
            <div className="data-header">{t("Launchpad:modal.deposit.deposit.title")}</div>
            <div className="data-box">
              <div className="data-row">
                <div className="key">{t("Launchpad:modal.deposit.deposit.col.depositAmount")}</div>
                <div className="value">
                  <Image src="/gns.svg" width={24} height={24} alt="GNS Token symbol" />
                  {depositAmount} {LAUNCHPAD_DEFAULT_DEPOSIT_TOKEN}
                </div>
              </div>
              <div className="data-row">
                <div className="key">{t("Launchpad:modal.deposit.deposit.col.poolTier")}</div>
                <div className="value">
                  {poolInfo?.poolTier ? <LaunchpadPoolTierChip poolTier={poolInfo.poolTier} /> : "-"}
                </div>
              </div>
              <div className="data-row">
                <div className="key">{t("Launchpad:modal.deposit.deposit.col.endDate")}</div>
                <div className="value">{poolInfo?.endTime ? getDateUtcToLocal(poolInfo.endTime).value : ""}</div>
              </div>
            </div>
          </div>
          <div className="data">
            <div className="data-header">{t("Launchpad:modal.deposit.reward.title")}</div>
            <div className="data-box">
              <div className="data-row">
                <div className="key">{t("Launchpad:modal.deposit.reward.col.rewardsToken")}</div>
                <div className="value">
                  <MissingLogo
                    symbol={rewardInfo.rewardTokenSymbol}
                    url={rewardInfo.rewardTokenLogoUrl}
                    width={24}
                    mobileWidth={24}
                  />{" "}
                  {rewardInfo.rewardTokenSymbol}
                </div>
              </div>
              <div className="data-row">
                <div className="key">{t("Launchpad:modal.deposit.reward.col.network")}</div>
                <div className="value">
                  <Image src={GNOT_TOKEN.logoURI} width={24} height={24} alt="Gno.land Token symbol" /> Gnoland (GRC20)
                </div>
              </div>
              <div className="data-row">
                <div className="key">{t("Launchpad:modal.deposit.reward.col.rewardsClaimableOn")}</div>
                <div className="value">{claimableTime ? getDateUtcToLocal(claimableTime).value : "-"}</div>
              </div>
            </div>
          </div>

          <div className="note">
            <div className="header">
              <IconWarning /> {t("Launchpad:modal.deposit.note.title")}
            </div>
            <ul className="contents">
              <li className="list">{t("Launchpad:modal.deposit.note.list1")}</li>
              <li className="list">
                <Trans ns="Launchpad" components={{ br: <br /> }} i18nKey={"modal.deposit.note.list2"} />
              </li>
            </ul>
            <Link href="https://docs.gnoswap.io/" target="_blank">
              <div className="learn-more">
                {t("Launchpad:modal.deposit.note.learnMore")} <IconOpenLink size="16" fill="#ff9f0a" />
              </div>
            </Link>
          </div>
        </div>
        <div className="footer">
          <Button
            text={t("Launchpad:modal.confirm.button")}
            onClick={confirm}
            style={{
              fullWidth: true,
              hierarchy: ButtonHierarchy.Primary,
            }}
          />
        </div>
      </div>
    </Modal>
  );
};

export default LaunchpadDepositModal;
