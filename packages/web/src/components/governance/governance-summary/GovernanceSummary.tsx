import { GovernanceSummaryWrapper } from "./GovernanceSummary.styles";
import { GovernanceDetailInfoProps } from "@containers/governance-container/GovernanceContainer";
import GovernanceDetail from "../governance-detail/GovernanceDetail";

interface GovernanceSummaryProps {
  governanceDetailInfo?: GovernanceDetailInfoProps;
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
