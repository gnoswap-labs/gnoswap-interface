import React from "react";

import FloatingTooltip from "@components/common/tooltip/FloatingTooltip";

import { ProgressBar, ProgressWrapper } from "./VotingProgressBar.styles";

interface VotingProgressBarProps {
  max: number;
  yes: number;
  no: number;
}

const VotingProgressBar: React.FC<VotingProgressBarProps> = ({
  max,
  yes,
  no,
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
      <div className="progress-value">
        <span>{(yes + no).toLocaleString()}</span>/
        <div> {max.toLocaleString()}</div>
      </div>
    </ProgressWrapper>
  );
};

export default VotingProgressBar;
