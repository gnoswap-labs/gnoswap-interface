import { GovernanceDetailData } from "./governance-detail/governance-detail-info/GovernanceDetailInfo";
import GovernanceDetail from "./governance-detail/GovernanceDetail";

import { GovernanceSummaryWrapper } from "./GovernanceSummary.styles";

interface GovernanceSummaryProps {
  governanceDetailInfo?: GovernanceDetailData;
  loading?: boolean;
}

const GovernanceSummary: React.FC<GovernanceSummaryProps> = ({
  governanceDetailInfo,
  loading,
}) => (
  <GovernanceSummaryWrapper>
    <GovernanceDetail loading={loading} governanceDetailInfo={governanceDetailInfo} />
  </GovernanceSummaryWrapper>
);

export default GovernanceSummary;
