import { SetStateAction } from "jotai";
import React, { Dispatch, useMemo } from "react";
import { useTranslation } from "react-i18next";

import Badge, { BADGE_TYPE } from "@components/common/badge/Badge";
import IconCheck from "@components/common/icons/IconCheck";
import { DEVICE_TYPE } from "@styles/media";

import { VoteButtonsWrapper } from "./VoteButtons.styles";

interface VoteButtonsWrapper {
  isClickable: boolean;
  votedType: string;
  isVoted: boolean;
  yesCount: number;
  noCount: number;
  breakpoint?: DEVICE_TYPE;
  selectedVote: string;
  setSelectedVote: Dispatch<SetStateAction<"YES" | "NO">>;
}

const VoteButtons: React.FC<VoteButtonsWrapper> = ({
  isClickable,
  breakpoint,
  votedType,
  isVoted,
  yesCount,
  noCount,
  selectedVote,
  setSelectedVote,
}) => {
  const { t } = useTranslation();

  const votedBadge = useMemo(() => {
    return breakpoint !== DEVICE_TYPE.MOBILE ? (
      <Badge className="badge" type={BADGE_TYPE.DARK_DEFAULT} text={t("Governance:detailModal.badge.voted")} />
    ) : (
      <div className="badge">
        <IconCheck />
      </div>
    );
  }, [breakpoint]);

  const buttons = [
    { type: "YES" as const, label: t("Governance:vote.yes"), count: yesCount },
    { type: "NO" as const, label: t("Governance:vote.no"), count: noCount },
  ];

  return (
    <VoteButtonsWrapper>
      {buttons.map(({ type, label, count }) => (
        <div
          key={type}
          className={[
            "vote-button",
            isClickable && selectedVote === type ? "active-button" : "",
            isClickable && votedType === "" ? "use-hover" : "",
          ].join(" ")}
          onClick={() => !votedType && setSelectedVote(type)}
        >
          <span>{label}</span>
          <div>{count.toLocaleString("en", { maximumFractionDigits: 0 })}</div>
          {isVoted && votedType === type && votedBadge}
        </div>
      ))}
    </VoteButtonsWrapper>
  );
};

export default VoteButtons;
