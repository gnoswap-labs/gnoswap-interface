import dayjs from "dayjs";
import relative from "dayjs/plugin/relativeTime";
import React from "react";
import { useTranslation } from "react-i18next";

import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import { ProposalItemInfo } from "@repositories/governance";

import StatusBadge from "../../status-badge/StatusBadge";
import TypeBadge from "../../type-badge/TypeBadge";
import VotingProgressBar from "../../voting-progress-bar/VotingProgressBar";

import { ProposalDetailWrapper } from "./ProposalCard.styles";
import Button, { ButtonHierarchy } from "@components/common/button/Button";

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

  return (
    <ProposalDetailWrapper
      onClick={() => onClickCard(proposalDetail.id.toString())}
    >
      <div className="header">
        <div className="left-section">
          <div className="title">
            {`#${proposalDetail.id} ${proposalDetail.title}`}
          </div>
          <TypeBadge type={proposalDetail.type} />
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

        <div className="right-section">
          <div className="proposer">
            By{" "}
            {proposalDetail.proposer.name ||
              [
                proposalDetail.proposer.address.slice(0, 8),
                proposalDetail.proposer.address.slice(32, 40),
              ].join("...")}
          </div>
          {proposalDetail.status === "PASSED" &&
            proposalDetail.type === "PARAMETER_CHANGE" && (
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
          {proposalDetail.status === "UPCOMMING" &&
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
        yes={proposalDetail.votes.yes}
        no={proposalDetail.votes.no}
      />
    </ProposalDetailWrapper>
  );
};

export default ProposalCard;
