import React from "react";
import Link from "next/link";
import Image from "next/image";

import { LaunchpadPoolModel } from "@models/launchpad";
import { useLaunchpadHandler } from "@hooks/launchpad/use-launchpad-handler";
import { ProjectRewardInfoModel } from "@views/launchpad/launchpad-detail/LaunchpadDetail";
import { getTierNumber } from "@utils/launchpad-get-tier-number";
import { LAUNCHPAD_DEFAULT_DEPOSIT_TOKEN } from "@common/values/token-constant";
import { GNOT_TOKEN } from "@common/values/token-constant";

import { LaunchpadDepositModalWrapper } from "./LaunchpadDepositModal.styles";
import IconClose from "@components/common/icons/IconCancel";
import IconWarning from "../../icons/IconWarning";
import IconOpenLink from "../../icons/IconOpenLink";
import Button, { ButtonHierarchy } from "../../button/Button";
import LaunchpadPoolTierChip from "@views/launchpad/components/launchpad-pool-tier-chip/LaunchpadPoolTierChip";
import { getDateUtcToLocal } from "@common/utils/date-util";
import MissingLogo from "@components/common/missing-logo/MissingLogo";

type LaunchpadPoolModelWithoutClaimableTime = Omit<
  LaunchpadPoolModel,
  "claimableTime"
>;

interface ExtendedPoolInfo extends LaunchpadPoolModelWithoutClaimableTime {
  claimableThreshold: number;
}

interface LaunchpadDepositModalProps {
  depositAmount: string;
  poolInfo?: ExtendedPoolInfo;
  rewardInfo: ProjectRewardInfoModel;
  projectPath: string;

  refetch: () => Promise<void>;
  close: () => void;
}

const LaunchpadDepositModal = ({
  depositAmount,
  poolInfo,
  rewardInfo,
  projectPath,
  refetch,
  close,
}: LaunchpadDepositModalProps) => {
  const now = new Date();
  const claimableTime = poolInfo?.claimableThreshold
    ? new Date(now.getTime() + Number(poolInfo.claimableThreshold) * 1000)
    : null;

  const { deposit } = useLaunchpadHandler();

  const poolDuration = getTierNumber(poolInfo?.poolTier);

  const confirm = React.useCallback(() => {
    deposit(`${projectPath}:${poolDuration}`, depositAmount, refetch);
  }, [projectPath, depositAmount, deposit, poolDuration, refetch]);

  return (
    <LaunchpadDepositModalWrapper>
      <div className="modal-body">
        <div className="header">
          <h6>Confirm Deposit</h6>
          <div className="close-wrap" onClick={close}>
            <IconClose className="close-icon" />
          </div>
        </div>
        <div className="content">
          <div className="data">
            <div className="data-header">Deposit Detail</div>
            <div className="data-box">
              <div className="data-row">
                <div className="key">Deposit Amount</div>
                <div className="value">
                  <Image
                    src="/gns.svg"
                    width={24}
                    height={24}
                    alt="GNS Token symbol"
                  />
                  {depositAmount} {LAUNCHPAD_DEFAULT_DEPOSIT_TOKEN}
                </div>
              </div>
              <div className="data-row">
                <div className="key">Pool Tier</div>
                <div className="value">
                  {poolInfo?.poolTier ? (
                    <LaunchpadPoolTierChip poolTier={poolInfo.poolTier} />
                  ) : (
                    "-"
                  )}
                </div>
              </div>
              <div className="data-row">
                <div className="key">End Date</div>
                <div className="value">
                  {poolInfo?.endTime
                    ? getDateUtcToLocal(poolInfo.endTime).value
                    : ""}
                </div>
              </div>
            </div>
          </div>
          <div className="data">
            <div className="data-header">Rewards Detail</div>
            <div className="data-box">
              <div className="data-row">
                <div className="key">Rewards Token</div>
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
                <div className="key">Network</div>
                <div className="value">
                  <Image
                    src={GNOT_TOKEN.logoURI}
                    width={24}
                    height={24}
                    alt="Gno.land Token symbol"
                  />{" "}
                  Gnoland (GRC20)
                </div>
              </div>
              <div className="data-row">
                <div className="key">Rewards Claimable On</div>
                <div className="value">
                  {claimableTime ? getDateUtcToLocal(claimableTime).value : "-"}
                </div>
              </div>
            </div>
          </div>

          <div className="note">
            <div className="header">
              <IconWarning /> Important Notes
            </div>
            <ul className="contents">
              <li className="list">
                Double-check to confirm that your deposit amount.
              </li>
              <li className="list">
                Only send supported tokens to this deposit address. <br />
                Depositing any other cryptocurrencies to this <br />
                launchpad will result in the loss of your funds.
              </li>
            </ul>
            <Link href="https://docs.gnoswap.io/" target="_blank">
              <div className="learn-more">
                Learn More <IconOpenLink size="16" fill="#ff9f0a" />
              </div>
            </Link>
          </div>
        </div>
        <div className="footer">
          <ConfirmButton onClick={confirm} />
        </div>
      </div>
    </LaunchpadDepositModalWrapper>
  );
};

const ConfirmButton = ({ onClick }: { onClick: () => void }) => {
  const defaultStyle = {
    fullWidth: true,
    hierarchy: ButtonHierarchy.Primary,
  };
  return <Button text="Confirm" style={defaultStyle} onClick={onClick} />;
};

export default LaunchpadDepositModal;
