import GovernanceDetailInfo, { GovernanceDetailData } from "./governance-detail-info/GovernanceDetailInfo";

import { GovernanceDetailWrapper } from "./GovernanceDetail.styles";

interface GovernanceDetailProps {
  governanceDetailInfo?: GovernanceDetailData;
  isLoading?: boolean;
}

const GovernanceDetail: React.FC<GovernanceDetailProps> = ({
  governanceDetailInfo,
  isLoading,
}) => (
  <GovernanceDetailWrapper>
    <GovernanceDetailInfo
      title={"Total xGNS Issued"}
      value={governanceDetailInfo?.totalXGnosIssued}
      tooltip={
        "Total amount of xGNS currently issued through GNS-GNOT staking."
      }
      currency="xGNS"
      isLoading={isLoading}
    />
    <GovernanceDetailInfo
      title={"Community Pool"}
      value={governanceDetailInfo?.communityPool}
      tooltip={
        "Amount of GNS accumulated in the Community Pool from Emissions."
      }
      currency="GNS"
      isLoading={isLoading}
    />
    <GovernanceDetailInfo
      title={"Passed Proposals"}
      value={governanceDetailInfo?.passedProposals}
      tooltip={"Proposals that were successfully executed."}
      isLoading={isLoading}
    />
    <GovernanceDetailInfo
      title={"Active Proposals"}
      value={governanceDetailInfo?.activeProposals}
      tooltip={"Proposals that are currently available for voting."}
      isLoading={isLoading}
    />
  </GovernanceDetailWrapper>
);

export default GovernanceDetail;
