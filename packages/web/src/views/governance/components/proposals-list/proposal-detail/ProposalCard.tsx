import { css, Global, type Theme } from "@emotion/react";
import dayjs from "dayjs";
import relative from "dayjs/plugin/relativeTime";
import React from "react";

import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import IconCircleInCancel from "@components/common/icons/IconCircleInCancel";
import IconCircleInCheck from "@components/common/icons/IconCircleInCheck";
import IconInfo from "@components/common/icons/IconInfo";
import IconOutlineClock from "@components/common/icons/IconOutlineClock";
import IconPass from "@components/common/icons/IconPass";
import { ProposalItemInfo } from "@repositories/governance";

import VotingProgressBar from "../../voting-progress-bar/VotingProgressBar";

import { ProposalDetailWrapper } from "./ProposalCard.styles";

dayjs.extend(relative);

interface Props {
  proposalDetail: ProposalItemInfo;
  onClickProposalDetail: (id: string) => void;
}

const ToolTipGlobalStyle = () => {
  return (
    <Global
      styles={(theme: Theme) => css`
        .float-progress {
          svg {
            fill: ${theme.color.background02};
          }
          div {
            font-size: 14px;
            font-weight: 700;
            background-color: ${theme.color.background02};
          }
        }
      `}
    />
  );
};

const MAPPING_STATUS: Record<string, JSX.Element> = {
  ACTIVE: (
    <div className="status success">
      <IconCircleInCheck className="success-icon status-icon" /> Active
    </div>
  ),
  REJECTED: (
    <div className="status failed">
      <IconCircleInCancel className="failed-icon status-icon" /> Reject
    </div>
  ),
  CANCELLED: (
    <div className="status cancelled">
      <IconInfo className="cancelled-icon status-icon" /> Cancelled
    </div>
  ),
  PASSED: (
    <div className="status passed">
      <IconPass className="passed-icon status-icon" /> Passed
    </div>
  ),
};

const ProposalCard: React.FC<Props> = ({
  proposalDetail,
  onClickProposalDetail,
}) => {

  return (
    <ProposalDetailWrapper
      onClick={() => onClickProposalDetail(proposalDetail.id.toString())}
    >
      <div className="header">
        <div className="title">
          {`#${proposalDetail.id} ${proposalDetail.title}`}
        </div>
        <Badge type={BADGE_TYPE.DARK_DEFAULT} text={proposalDetail.type} />
      </div>
      <div className="active-wrapper">
        {MAPPING_STATUS[proposalDetail.status]}
        <div className="status time">
          <IconOutlineClock />{" "}
          {`Voting ${
            proposalDetail.status === "ACTIVE" ? "Ends in" : "Ended"
          } ${dayjs(proposalDetail.time).fromNow()} ${proposalDetail.time}`}
        </div>
      </div>
      <VotingProgressBar
        max={proposalDetail.votes.max}
        yes={proposalDetail.votes.yes}
        no={proposalDetail.votes.no}
      />
      <ToolTipGlobalStyle />
    </ProposalDetailWrapper>
  );
};

export default ProposalCard;
