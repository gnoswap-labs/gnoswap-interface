import { RANGE_STATUS_OPTION } from "@constants/option.constant";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { RangeDot, RangeBadgeText, RangeBadgeWrapper } from "./RangeBadge.styles";

export interface RangeBadgeProps {
  status: RANGE_STATUS_OPTION;
  className?: string;
  isClosed?: boolean;
}

const RangeBadge: React.FC<RangeBadgeProps> = ({ status, className, isClosed }) => {
  const { t } = useTranslation();

  const statusText = useMemo(() => {
    if (isClosed) return t("common:closed");

    switch (status) {
      case RANGE_STATUS_OPTION.IN:
        return t("business:rangeStatus.active");
      case RANGE_STATUS_OPTION.OUT:
        return t("business:rangeStatus.inactive");
      case RANGE_STATUS_OPTION.NONE:
      default:
        return t("common:closed");
    }
  }, [isClosed, status, t]);

  return (
    <RangeBadgeWrapper className={className}>
      <RangeDot status={status} />
      <RangeBadgeText status={status}>{statusText}</RangeBadgeText>
    </RangeBadgeWrapper>
  );
};

export default RangeBadge;
