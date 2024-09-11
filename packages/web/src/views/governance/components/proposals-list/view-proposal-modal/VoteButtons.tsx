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
  yesCount: number;
  noCount: number;
  breakpoint?: DEVICE_TYPE;
  selectedVote: string;
  setSelectedVote: Dispatch<SetStateAction<string>>;
}

const VoteButtons : React.FC<VoteButtonsWrapper> = ({
  isClickable,
  breakpoint,
  votedType,
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
        className={[
          "vote-button",
          isClickable && selectedVote === "YES" ? "active-button" : "",
          isClickable && votedType === "" ? "use-hover" : "",
        ].join(" ")}
        onClick={() => !votedType && setSelectedVote("YES")}
      >
        <span>{t("Governance:vote.yes")}</span>
        <div>{yesCount.toLocaleString("en", { maximumFractionDigits: 0 })}</div>
        {votedType === "YES" && votedBadge}
      </div>
      <div
        className={[
          "vote-button",
          isClickable && selectedVote === "NO" ? "active-button" : "",
          isClickable && votedType === "" ? "use-hover" : "",
        ].join(" ")}
        onClick={() => !votedType && setSelectedVote("NO")}
      >
        <span>{t("Governance:vote.no")}</span>
        <div>{noCount.toLocaleString("en", { maximumFractionDigits: 0 })}</div>
        {votedType === "NO" && votedBadge}
      </div>
    </VoteButtonsWrapper>
  );
};

export default VoteButtons;