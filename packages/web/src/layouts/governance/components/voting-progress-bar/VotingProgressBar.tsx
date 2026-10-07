import { css, Global, Theme } from "@emotion/react";
import React from "react";
import { Trans, useTranslation } from "react-i18next";

import FloatingTooltip from "@components/common/tooltip/FloatingTooltip";

import { ProgressBar, ProgressWrapper, ProposalTooltipContent } from "./VotingProgressBar.styles";
import IconPassed from "@components/common/icons/IconPassed";
import Tooltip from "@components/common/tooltip/Tooltip";
interface VotingProgressBarProps {
  max: number;
  yes: number;
  no: number;
  isMajorityVoted: boolean;
  hideNumber?: boolean;
  tooltipTextI18nKey?: string;
}

const VotingProgressBar: React.FC<VotingProgressBarProps> = ({
  max,
  yes,
  no,
  isMajorityVoted,
  hideNumber,
  tooltipTextI18nKey,
}) => {
  const { t } = useTranslation();

  const hasVoted = React.useMemo(() => {
    return Boolean(yes) || Boolean(no);
  }, [yes, no]);

  const getProgressRate = (value: number) => {
    if (!max) return 0;

    return Math.min((100 * value) / max, 100);
  };

  const yesRate = getProgressRate(yes);
  const noRate = getProgressRate(no);
  const totalRate = Math.min(yesRate + noRate, 100);

  return (
    <ProgressWrapper>
      <ProgressBar rateWidth={`${yesRate}%`} noOfQuorumWidth={`${totalRate}%`}>
        <FloatingTooltip
          className="float-progress"
          position="top"
          content={`${t("Governance:vote.yes")} ${yesRate.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}%`}
        >
          <div className="progress-bar-yes-of-quorum progress-bar-rate" />
        </FloatingTooltip>
        <FloatingTooltip
          className="float-progress"
          position="top"
          content={`${t("Governance:vote.no")} ${noRate.toLocaleString(undefined, {
            maximumFractionDigits: 2,
          })}%`}
        >
          <div className="progress-bar-no-of-quorum progress-bar-rate" />
        </FloatingTooltip>
      </ProgressBar>
      {!hideNumber && (
        <div className="progress-value">
          <Tooltip
            forcedClose={!hasVoted}
            placement="top"
            FloatingContent={
              <ProposalTooltipContent>
                <Trans
                  components={{ br: <br /> }}
                  ns="Governance"
                  i18nKey={tooltipTextI18nKey}
                  className="tooltip-contents"
                />
              </ProposalTooltipContent>
            }
          >
            <span className={isMajorityVoted ? "passed" : ""}>
              {isMajorityVoted && <IconPassed />}
              {(yes + no).toLocaleString()}
            </span>
          </Tooltip>
          /<div> {max.toLocaleString()}</div>
        </div>
      )}
      <ToolTipGlobalStyle />
    </ProgressWrapper>
  );
};

export default VotingProgressBar;

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
