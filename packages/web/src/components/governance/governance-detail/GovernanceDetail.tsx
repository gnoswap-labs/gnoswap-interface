import { GovernanceDetailWrapper } from "./GovernanceDetail.styles";
import { GovernanceDetailInfoProps } from "@containers/governance-container/GovernanceContainer";
import GovernanceDetailInfo from "../governance-detail-info/GovernanceDetailInfo";

interface GovernanceDetailProps {
  governanceDetailInfo?: GovernanceDetailInfoProps;
  loading?: boolean;
}

const GovernanceDetail: React.FC<GovernanceDetailProps> = ({
  governanceDetailInfo,
  loading,
}) => (
  <GovernanceDetailWrapper>
    <GovernanceDetailInfo
      title={"Total xGNS Issued"}
      value={governanceDetailInfo?.totalXGnosIssued}
      tooltip={
        "Total amount of xGNS currently issued through GNS-GNOT staking."
      }
      currency="xGNS"
      loading={loading}
    />
    <GovernanceDetailInfo
      title={"Community Pool"}
      value={governanceDetailInfo?.communityPool}
      tooltip={
        "Amount of GNS accumulated in the Community Pool from Emissions."
      }
      currency="GNS"
      loading={loading}
    />
    <GovernanceDetailInfo
      title={"Passed Proposals"}
      value={governanceDetailInfo?.passedProposals}
      tooltip={"Proposals that were successfully executed."}
      loading={loading}
    />
    <GovernanceDetailInfo
      title={"Active Proposals"}
      value={governanceDetailInfo?.activeProposals}
      tooltip={"Proposals that are currently available for voting."}
      loading={loading}
    />
  </GovernanceDetailWrapper>
);

export default GovernanceDetail;
