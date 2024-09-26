import dayjs from "dayjs";
import relative from "dayjs/plugin/relativeTime";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconNewTab from "@components/common/icons/IconNewTab";
import { ProposalItemInfo } from "@repositories/governance";

import StatusBadge from "../../status-badge/StatusBadge";
import TypeBadge from "../../type-badge/TypeBadge";
import VotingProgressBar from "../../voting-progress-bar/VotingProgressBar";

import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";
import { ProposalDetailWrapper } from "./ProposalCard.styles";

dayjs.extend(relative);

interface Props {
  address: string;
  proposalDetail: ProposalItemInfo;
  onClickCard: (id: string) => void;
  executeProposal: (id: number) => void;
  cancelProposal: (id: number) => void;
}

const ProposalCard: React.FC<Props> = ({
  address,
  proposalDetail,
  onClickCard,
  executeProposal,
  cancelProposal,
}) => {
  const { t } = useTranslation();
  const { getAccountUrl } = useGnoscanUrl();
  const [currentTime, setCurrentTime] = useState(new Date().getTime());

  const executable = useMemo(() => {
    if (!address) {
      return false;
    }

    if (proposalDetail.status !== "PASSED") {
      return false;
    }

    if (
      !["PARAMETER_CHANGE", "COMMUNITY_POOL_SPEND"].includes(
        proposalDetail.type,
      )
    ) {
      return false;
    }

    return true;
  }, [address, proposalDetail]);

  const availExecutableButton = useMemo(() => {
    if (!executable) {
      return false;
    }

    if (!proposalDetail.executableTime || !proposalDetail.expiredTime) {
      return false;
    }

    const executableTime = new Date(
      new Date(proposalDetail.executableTime).toUTCString(),
    ).getTime();
    const expiredTime = new Date(
      new Date(proposalDetail.expiredTime).toUTCString(),
    ).getTime();

    return expiredTime > currentTime && currentTime >= executableTime;
  }, [
    currentTime,
    executable,
    proposalDetail.executableTime,
    proposalDetail.expiredTime,
  ]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (executable) {
      intervalId = setInterval(() => {
        setCurrentTime(new Date().getTime());
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [executable, proposalDetail.status]);

  return (
    <ProposalDetailWrapper
      onClick={() => onClickCard(proposalDetail.id.toString())}
    >
      <div className="header">
        <div className="left-section">
          <div className="title">
            {`#${proposalDetail.id} ${proposalDetail.title}`}
          </div>
          <div className="badges">
            <TypeBadge type={proposalDetail.type} />
            {proposalDetail.status === "EXPIRED" && (
              <Badge
                className="proposal-badge"
                type={BADGE_TYPE.DARK_DEFAULT}
                text={t("Governance:proposal.status.expired")}
              />
            )}
            {proposalDetail.status === "EXECUTED" && (
              <Badge
                className="proposal-badge"
                type={BADGE_TYPE.DARK_DEFAULT}
                text={t("Governance:proposal.status.executed")}
              />
            )}
            {proposalDetail.myVote && proposalDetail.myVote.type !== "" && (
              <Badge
                className="proposal-badge"
                type={BADGE_TYPE.DARK_DEFAULT}
                text={t("Governance:detailModal.badge.voted")}
              />
            )}
          </div>
        </div>

        <div className="right-section">
          <div
            className="proposer"
            onClick={e => {
              e.stopPropagation();
              window.open(
                getAccountUrl(proposalDetail.proposer.address),
                "_blank",
              );
            }}
          >
            By{" "}
            {proposalDetail.proposer.name ||
              [
                proposalDetail.proposer.address.slice(0, 8),
                proposalDetail.proposer.address.slice(32, 40),
              ].join("...")}
            <IconNewTab />
          </div>
          {availExecutableButton && (
            <Button
              text={t("Governance:proposalList.executeBtn")}
              style={{
                hierarchy: ButtonHierarchy.Primary,
              }}
              onClick={e => {
                e.stopPropagation();
                executeProposal(proposalDetail.id);
              }}
            />
          )}
          {proposalDetail.status === "UPCOMING" &&
            proposalDetail.proposer.address === address && (
              <Button
                text={t("Governance:proposalList.cancelBtn")}
                style={{
                  hierarchy: ButtonHierarchy.Primary,
                }}
                onClick={e => {
                  e.stopPropagation();
                  cancelProposal(proposalDetail.id);
                }}
              />
            )}
        </div>
      </div>
      <div className="active-wrapper">
        <StatusBadge
          status={proposalDetail.status}
          time={proposalDetail.time}
        />
      </div>
      <VotingProgressBar
        max={proposalDetail.votes.max}
        yes={
          proposalDetail.status === "CANCELLED" ? 0 : proposalDetail.votes.yes
        }
        no={proposalDetail.status === "CANCELLED" ? 0 : proposalDetail.votes.no}
      />
    </ProposalDetailWrapper>
  );
};

export default ProposalCard;
