import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import IconCircleInCheck from "@components/common/icons/IconCircleInCheck";
import IconOutlineClock from "@components/common/icons/IconOutlineClock";
import FloatingTooltip from "@components/common/tooltip/FloatingTooltip";
import {
  ProgressBar,
  ProgressWrapper,
  ProposalDetailWrapper,
} from "./ProposalDetail.styles";
import React from "react";
import IconCircleInCancel from "@components/common/icons/IconCircleInCancel";
import IconInfo from "@components/common/icons/IconInfo";
import { ProposalDetailProps } from "@containers/proposal-list-container/ProposalListContainer";
import IconPass from "@components/common/icons/IconPass";
import { Global, css, type Theme } from "@emotion/react";

interface Props {
  proposalDetail: ProposalDetailProps;
}

const ToolTipGlobalStyle = () => {
  return (
    <Global
      styles={(theme: Theme) => css`
        .float-progress {
          svg {
            fill: ${theme.color.background12};
          }
          div {
            background-color: ${theme.color.background12};
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

const ProposalDetail: React.FC<Props> = ({ proposalDetail }) => {
  return (
    <ProposalDetailWrapper>
      <div className="header">
        <div className="title">{proposalDetail.title}</div>
        <Badge type={BADGE_TYPE.DARK_DEFAULT} text={proposalDetail.label} />
      </div>
      <div className="active-wrapper">
        {MAPPING_STATUS[proposalDetail.status]}
        <div className="status time">
          <IconOutlineClock /> {proposalDetail.timeEnd}
        </div>
      </div>
      <ProgressWrapper>
        <ProgressBar
          rateWidth={`${proposalDetail.yesOfQuorum}%`}
          abstainOfQuorumWidth={`${
            proposalDetail.abstainOfQuorum +
            proposalDetail.yesOfQuorum +
            proposalDetail.noOfQuorum
          }%`}
          noOfQuorumWidth={`${
            proposalDetail.noOfQuorum + proposalDetail.yesOfQuorum
          }%`}
        >
          <FloatingTooltip
            className="float-progress"
            position="top"
            content={`Yes ${proposalDetail.yesOfQuorum}%`}
          >
            <div className="progress-bar-yes-of-quorum progress-bar-rate" />
          </FloatingTooltip>
          <FloatingTooltip
            className="float-progress"
            position="top"
            content={`No ${proposalDetail.noOfQuorum}%`}
          >
            <div className="progress-bar-no-of-quorum progress-bar-rate" />
          </FloatingTooltip>
          <FloatingTooltip
            className="float-progress"
            position="top"
            content={`Abstain ${proposalDetail.abstainOfQuorum}%`}
          >
            <div className="progress-bar-abstain progress-bar-rate" />
          </FloatingTooltip>
        </ProgressBar>
        <div className="progress-value">
          <span>{proposalDetail.currentValue.toLocaleString()}</span>/
          <div> {proposalDetail.maxValue.toLocaleString()}</div>
        </div>
      </ProgressWrapper>
      <ToolTipGlobalStyle />
    </ProposalDetailWrapper>
  );
};

export default ProposalDetail;
