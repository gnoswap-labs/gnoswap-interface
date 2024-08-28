import dayjs from "dayjs";
import relative from "dayjs/plugin/relativeTime";
import React from "react";

import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import { ProposalItemInfo } from "@repositories/governance";

import StatusBadge from "../../status-badge/StatusBadge";
import VotingProgressBar from "../../voting-progress-bar/VotingProgressBar";

import { ProposalDetailWrapper } from "./ProposalCard.styles";

dayjs.extend(relative);

interface Props {
  proposalDetail: ProposalItemInfo;
  onClickCard: (id: string) => void;
}

const ProposalCard: React.FC<Props> = ({
  proposalDetail,
  onClickCard,
}) => {

  return (
    <ProposalDetailWrapper
      onClick={() => onClickCard(proposalDetail.id.toString())}
    >
      <div className="header">
        <div className="left-section">
          <div className="title">
            {`#${proposalDetail.id} ${proposalDetail.title}`}
          </div>
          <Badge
            className="proposal-badge"
            type={BADGE_TYPE.DARK_DEFAULT}
            text={proposalDetail.type}
          />
          {proposalDetail.status === "Executed" && (
            <Badge
              className="proposal-badge"
              type={BADGE_TYPE.DARK_DEFAULT}
              text={proposalDetail.status}
            />
          )}
        </div>
        <div className="proponent">By {proposalDetail.proponent}</div>
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
