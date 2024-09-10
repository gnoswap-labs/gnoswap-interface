import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import { DEVICE_TYPE } from "@styles/media";

interface VoteCtaButtonProps {
  breakpoint: DEVICE_TYPE;
  isWalletConnected: boolean;
  isSwitchNetwork: boolean;
  voteType?: string;
  voteWeigth?: number;
  status: string;
  selectedVote: string;
  handleVote: (voteType: boolean) => void;
  connectWallet: () => void;
  switchNetwork: () => void;
}

const VoteCtaButton: React.FC<VoteCtaButtonProps> = ({
  breakpoint,
  isWalletConnected,
  isSwitchNetwork,
  voteType,
  voteWeigth,
  status,
  selectedVote,
  handleVote,
  connectWallet,
  switchNetwork,
}) => {
  const { t } = useTranslation();

  const btnStatus: {
    disabled: boolean;
    text: string;
    action: (() => void) | null;
  } = useMemo(() => {
    if (status === "UPCOMING")
      return {
        disabled: true,
        text: t("Governance:proposal.status.upcomming"),
        action: null,
      };
    if (status === "REJECTED")
      return {
        disabled: true,
        text: t("Governance:proposal.status.rejected"),
        action: null,
      };
    if (status === "CANCELLED")
      return {
        disabled: true,
        text: t("Governance:proposal.status.cancelled"),
        action: null,
      };
    if (status === "EXECUTED")
      return {
        disabled: true,
        text: t("Governance:proposal.status.executed"),
        action: null,
      };
    if (!isWalletConnected)
      return {
        disabled: false,
        text: t("Governance:detailModal.btn.login"),
        action: connectWallet,
      };
    if (isSwitchNetwork)
      return {
        disabled: false,
        text: t("Governance:detailModal.btn.switchNetwork"),
        action: switchNetwork,
      };
    // need to check more specific cases
    if (status === "PASSED")
      return {
        disabled: true,
        text: t("Governance:proposal.status.passed"),
        action: null,
      };
    if (!voteWeigth) {
      return {
        disabled: true,
        text: t("Governance:detailModal.btn.noVoteWeight"),
        action: null,
      };
    }
    if (voteType !== undefined && voteType !== "")
      return {
        disabled: true,
        text: t("Governance:detailModal.btn.alreadyVoted"),
        action: null,
      };
    if (selectedVote !== "")
      return {
        disabled: false,
        text: t("Governance:detailModal.btn.vote"),
        action: () => handleVote(selectedVote === "YES"),
      };
    return {
      disabled: true,
      text: t("Governance:detailModal.btn.requireSelect"),
      action: null,
    };
  }, [
    status,
    t,
    isWalletConnected,
    connectWallet,
    isSwitchNetwork,
    switchNetwork,
    voteType,
    selectedVote,
    handleVote,
    voteWeigth,
  ]);

  return (
    <Button
      disabled={btnStatus.disabled}
      text={btnStatus.text}
      style={{
        fullWidth: true,
        height: breakpoint !== DEVICE_TYPE.MOBILE ? 57 : 41,
        fontType: breakpoint !== DEVICE_TYPE.MOBILE ? "body7" : "body9",
        textColor: "text09",
        bgColor: "background17",
        width: breakpoint !== DEVICE_TYPE.MOBILE ? undefined : "304px",
        hierarchy: btnStatus.disabled ? undefined : ButtonHierarchy.Primary,
      }}
      onClick={() => btnStatus.action && btnStatus.action()}
    />
  );
};

export default VoteCtaButton;