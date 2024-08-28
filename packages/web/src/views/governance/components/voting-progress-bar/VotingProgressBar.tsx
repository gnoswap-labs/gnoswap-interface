import { css, Global, Theme } from "@emotion/react";
import React from "react";

import FloatingTooltip from "@components/common/tooltip/FloatingTooltip";

import { ProgressBar, ProgressWrapper } from "./VotingProgressBar.styles";

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

interface VotingProgressBarProps {
  max: number;
  yes: number;
  no: number;
  hideNumber?: boolean;
}

const VotingProgressBar: React.FC<VotingProgressBarProps> = ({
  max,
  yes,
  no,
  hideNumber,
}) => {
  const yesRate = (100 * yes) / max;
  const noRate = (100 * no) / max;

  return (
    <ProgressWrapper>
      <ProgressBar
        rateWidth={`${yesRate}%`}
        noOfQuorumWidth={`${Number(yesRate) + Number(noRate)}%`}
      >
        <FloatingTooltip
          className="float-progress"
          position="top"
          content={`Yes ${yesRate.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}%`}
        >
          <div className="progress-bar-yes-of-quorum progress-bar-rate" />
        </FloatingTooltip>
        <FloatingTooltip
          className="float-progress"
          position="top"
          content={`No ${noRate.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}%`}
        >
          <div className="progress-bar-no-of-quorum progress-bar-rate" />
        </FloatingTooltip>
      </ProgressBar>
      {!hideNumber && (
        <div className="progress-value">
          <span>{(yes + no).toLocaleString()}</span>/
          <div> {max.toLocaleString()}</div>
        </div>
      )}
      <ToolTipGlobalStyle />
    </ProgressWrapper>
  );
};

export default VotingProgressBar;
