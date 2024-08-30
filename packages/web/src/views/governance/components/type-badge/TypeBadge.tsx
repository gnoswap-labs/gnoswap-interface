import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { BADGE_TYPE } from "@components/common/badge/Badge";

import { TypeBadgeWrapper } from "./TypeBadge.styles";

interface VoteButtonsWrapper {
  type: string;
}

const TypeBadge: React.FC<VoteButtonsWrapper> = ({ type }) => {
  const { t } = useTranslation();

  const badgeText = useMemo(() => {
    switch (type) {
      case "TEXT":
        return t("Governance:proposal.type.text");
      case "COMMUNITY_POOL_SPEND":
        return t("Governance:proposal.type.community");
      case "PARAMETER_CHANGE":
        return t("Governance:proposal.type.paramChange");
      default:
        return "unsupport type";
    }
  }, [t, type]);

  return (
    <TypeBadgeWrapper
      className="proposal-badge"
      type={BADGE_TYPE.DARK_DEFAULT}
      text={badgeText}
    />
  );
};

export default TypeBadge;
