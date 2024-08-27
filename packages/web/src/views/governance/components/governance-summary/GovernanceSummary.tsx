import { GovernanceDetailData } from "./governance-detail/governance-detail-info/GovernanceDetailInfo";
import GovernanceDetail from "./governance-detail/GovernanceDetail";

import { GovernanceSummaryWrapper } from "./GovernanceSummary.styles";

interface GovernanceSummaryProps {
  governanceDetailInfo?: GovernanceDetailData;
  isLoading?: boolean;
}

const GovernanceSummary: React.FC<GovernanceSummaryProps> = ({
  governanceDetailInfo,
  isLoading,
}) => (
  <GovernanceSummaryWrapper>
    <GovernanceDetail isLoading={isLoading} governanceDetailInfo={governanceDetailInfo} />
  </GovernanceSummaryWrapper>
);

export default GovernanceSummary;
