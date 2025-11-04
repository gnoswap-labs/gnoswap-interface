import dayjs from "dayjs";
import relative from "dayjs/plugin/relativeTime";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import Button, { ButtonHierarchy } from "@components/common/button/Button";
import IconNewTab from "@components/common/icons/IconNewTab";
import { ProposalItemInfo, PROPOSAL_TYPE } from "@repositories/governance";
import { safeParseTime } from "@utils/time.utils";

import StatusBadge from "../../status-badge/StatusBadge";
import TypeBadge from "../../type-badge/TypeBadge";
import VotingProgressBar from "../../voting-progress-bar/VotingProgressBar";

import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";
import { ProposalDetailWrapper } from "./ProposalCard.styles";
import { DEVICE_TYPE } from "@styles/media";
import { rawToDisplayAmount } from "@utils/number-utils";
import { XGNS_TOKEN } from "@common/values/token-constant";

dayjs.extend(relative);

interface Props {
  address: string;
  breakpoint: DEVICE_TYPE;
  proposalDetail: ProposalItemInfo;
  isMajorityVoted: boolean;
  getTooltipTextI18nKey: (status: string, isMajorityVoted: boolean, yesVotes: number, noVotes: number) => string;
  onClickCard: (id: string) => void;
  executeProposal: (id: number) => void;
  cancelProposal: (id: number) => void;
}

const ProposalCard: React.FC<Props> = ({
  address,
  breakpoint,
  proposalDetail,
  isMajorityVoted,
  getTooltipTextI18nKey,
  onClickCard,
  executeProposal,
  cancelProposal,
}) => {
  const { t } = useTranslation();
  const { getAccountUrl } = useGnoscanUrl();
  const [currentTime, setCurrentTime] = useState(new Date().getTime());

  const safeDisplayAmount = (weight: string | number): number => {
    const result = rawToDisplayAmount(weight, XGNS_TOKEN.decimals);
    return isNaN(result) ? 0 : result;
  };

  const executable = useMemo(() => {
    if (!address) {
      return false;
    }

    if (proposalDetail.status !== "PASSED") {
      return false;
    }

    if (
      proposalDetail.proposalType !== PROPOSAL_TYPE.PROPOSAL_PARAMETER_CHANGE &&
      proposalDetail.proposalType !== PROPOSAL_TYPE.PROPOSAL_COMMUNITY_POOL_SPEND
    ) {
      return false;
    }

    return true;
  }, [address, proposalDetail]);

  const availExecutableButton = useMemo(() => {
    if (!executable) return false;

    const executableTime = safeParseTime(proposalDetail.executableTime);
    const expiredTime = safeParseTime(proposalDetail.expiredTime);

    if (executableTime === null || expiredTime === null) {
      return false;
    }

    return expiredTime > currentTime && currentTime >= executableTime;
  }, [currentTime, executable, proposalDetail.executableTime, proposalDetail.expiredTime]);

  const votingNumbers = useMemo(() => {
    const isCancelled = proposalDetail.status === "CANCELLED";

    return {
      max: safeDisplayAmount(proposalDetail.votingInfo.maxVotingWeight),
      yes: isCancelled ? 0 : safeDisplayAmount(proposalDetail.votingInfo.yesVotingWeight),
      no: isCancelled ? 0 : safeDisplayAmount(proposalDetail.votingInfo.noVotingWeight),
    };
  }, [proposalDetail.status, proposalDetail.votingInfo]);

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

  const { yesVotes, noVotes } = useMemo(() => {
    if (proposalDetail.status === "CANCELLED") {
      return { yesVotes: 0, noVotes: 0 };
    }
    return {
      yesVotes: Number(proposalDetail.votingInfo.yesVotingWeight) || 0,
      noVotes: Number(proposalDetail.votingInfo.noVotingWeight) || 0,
    };
  }, [proposalDetail.status, proposalDetail.votingInfo]);

  const tooltipTextI18nKey = React.useMemo(() => {
    return getTooltipTextI18nKey(proposalDetail.status, isMajorityVoted, yesVotes, noVotes);
  }, [proposalDetail.status, getTooltipTextI18nKey, isMajorityVoted, yesVotes, noVotes]);

  const showCancelButton = React.useMemo(() => {
    return proposalDetail.status === "UPCOMING" && proposalDetail.proposer.address === address;
  }, [proposalDetail.status, proposalDetail.proposer.address, address]);

  const handleCancelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    cancelProposal(proposalDetail.id);
  };

  return (
    <ProposalDetailWrapper onClick={() => onClickCard(proposalDetail.id.toString())}>
      <div className="header">
        <div className="left-section">
          <div className="title">{`#${proposalDetail.id} ${proposalDetail.title}`}</div>
          <div className="badges">
            <TypeBadge type={proposalDetail.proposalType} />
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
            {proposalDetail.userVotingInfo && proposalDetail.userVotingInfo.isVoted && (
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
              window.open(getAccountUrl(proposalDetail.proposer.address), "_blank");
            }}
          >
            By{" "}
            {proposalDetail.proposer.name ||
              [proposalDetail.proposer.address.slice(0, 8), proposalDetail.proposer.address.slice(32, 40)].join("...")}
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
          {showCancelButton && breakpoint !== DEVICE_TYPE.MOBILE && (
            <Button
              text={t("Governance:proposalList.cancelBtn")}
              style={{
                hierarchy: ButtonHierarchy.Primary,
              }}
              onClick={handleCancelClick}
            />
          )}
        </div>
      </div>
      {showCancelButton && breakpoint === DEVICE_TYPE.MOBILE && (
        <Button
          text={t("Governance:proposalList.cancelBtn")}
          style={{
            width: "100%",
            height: "36px",
            fontType: "p1",
            hierarchy: ButtonHierarchy.Primary,
          }}
          onClick={handleCancelClick}
        />
      )}
      <div className="active-wrapper">
        <StatusBadge
          breakpoint={breakpoint}
          status={proposalDetail.status}
          time={safeParseTime(proposalDetail.statusTime)}
        />
      </div>
      <VotingProgressBar
        max={votingNumbers.max}
        yes={votingNumbers.yes}
        no={votingNumbers.no}
        tooltipTextI18nKey={tooltipTextI18nKey}
        isMajorityVoted={isMajorityVoted}
      />
    </ProposalDetailWrapper>
  );
};

export default ProposalCard;
