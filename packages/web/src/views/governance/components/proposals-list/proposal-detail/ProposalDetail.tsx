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
import FloatingTooltip from "@components/common/tooltip/FloatingTooltip";
import { ProposalItemInfo } from "@repositories/governance";

import {
  ProgressBar,
  ProgressWrapper,
  ProposalDetailWrapper
} from "./ProposalDetail.styles";

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

const ProposalDetail: React.FC<Props> = ({
  proposalDetail,
  onClickProposalDetail,
}) => {
  const yesRate = (
    (100 * proposalDetail.votes.yes) /
    proposalDetail.votes.max
  ).toLocaleString(undefined, { maximumFractionDigits: 2 });
  const noRate = (
    (100 * proposalDetail.votes.no) /
    proposalDetail.votes.max
  ).toLocaleString(undefined, { maximumFractionDigits: 2 });

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
      <ProgressWrapper>
        <ProgressBar
          rateWidth={`${yesRate}%`}
          noOfQuorumWidth={`${Number(yesRate) + Number(noRate)}%`}
        >
          <FloatingTooltip
            className="float-progress"
            position="top"
            content={`Yes ${yesRate}%`}
          >
            <div className="progress-bar-yes-of-quorum progress-bar-rate" />
          </FloatingTooltip>
          <FloatingTooltip
            className="float-progress"
            position="top"
            content={`No ${noRate}%`}
          >
            <div className="progress-bar-no-of-quorum progress-bar-rate" />
          </FloatingTooltip>
        </ProgressBar>
        <div className="progress-value">
          <span>
            {(
              proposalDetail.votes.yes + proposalDetail.votes.no
            ).toLocaleString()}
          </span>
          /<div> {proposalDetail.votes.max.toLocaleString()}</div>
        </div>
      </ProgressWrapper>
      <ToolTipGlobalStyle />
    </ProposalDetailWrapper>
  );
};

export default ProposalDetail;
