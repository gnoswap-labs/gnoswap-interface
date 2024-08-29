import { SetStateAction } from "jotai";
import React, { Dispatch, useMemo } from "react";
import { useTranslation } from "react-i18next";

import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import IconCheck from "@components/common/icons/IconCheck";
import { DEVICE_TYPE } from "@styles/media";

import { VoteButtonsWrapper } from "./VoteButtons.styles";

interface VoteButtonsWrapper {
  isVoted: boolean;
  yesCount: number;
  noCount: number;
  breakpoint?: DEVICE_TYPE;
  selectedVote: string;
  setSelectedVote: Dispatch<SetStateAction<string>>;
}

const VoteButtons : React.FC<VoteButtonsWrapper> = ({
  breakpoint,
  isVoted,
  yesCount,
  noCount,
  selectedVote,
  setSelectedVote,
}) => {
  const { t } = useTranslation();

  const votedBadge = useMemo(() => {
    return breakpoint !== DEVICE_TYPE.MOBILE ? (
      <Badge
        className="badge"
        type={BADGE_TYPE.DARK_DEFAULT}
        text={t("Governance:detailModal.badge.voted")}
      />
    ) : (
      <div className="badge">
        <IconCheck />
      </div>
    );
  }, [breakpoint]);

  return (
    <VoteButtonsWrapper>
      <div
        className={`vote-button ${
          selectedVote === "YES" ? "active-button" : ""
        }`}
        onClick={() => !isVoted && setSelectedVote("YES")}
      >
        <span>{t("Governance:vote.yes")}</span>
        <div>{yesCount.toLocaleString()}</div>
        {isVoted && selectedVote === "YES" && votedBadge}
      </div>
      <div
        className={`vote-button ${
          selectedVote === "NO" ? "active-button" : ""
        }`}
        onClick={() => !isVoted && setSelectedVote("NO")}
      >
        <span>{t("Governance:vote.no")}</span>
        <div>{noCount.toLocaleString()}</div>
        {isVoted && selectedVote === "NO" && votedBadge}
      </div>
    </VoteButtonsWrapper>
  );
};

export default VoteButtons;