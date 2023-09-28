import { GovernanceSummaryWrapper } from "./GovernanceSummary.styles";
import { GovernanceDetailInfoProps } from "@containers/governance-container/GovernanceContainer";
import GovernanceDetail from "../governance-detail/GovernanceDetail";

interface GovernanceSummaryProps {
  governanceDetailInfo: GovernanceDetailInfoProps;
}

const GovernanceSummary: React.FC<GovernanceSummaryProps> = ({
  governanceDetailInfo,
}) => (
  <GovernanceSummaryWrapper>
    <GovernanceDetail governanceDetailInfo={governanceDetailInfo} />
  </GovernanceSummaryWrapper>
);

export default GovernanceSummary;
