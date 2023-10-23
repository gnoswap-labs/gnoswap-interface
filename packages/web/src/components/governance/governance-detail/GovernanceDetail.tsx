import { GovernanceDetailWrapper } from "./GovernanceDetail.styles";
import { GovernanceDetailInfoProps } from "@containers/governance-container/GovernanceContainer";
import GovernanceDetailInfo from "../governance-detail-info/GovernanceDetailInfo";

interface GovernanceDetailProps {
  governanceDetailInfo: GovernanceDetailInfoProps;
}

const GovernanceDetail: React.FC<GovernanceDetailProps> = ({
  governanceDetailInfo,
}) => (
  <GovernanceDetailWrapper>
    <GovernanceDetailInfo
      title={"Total xGNOS Issued"}
      value={governanceDetailInfo.totalXGnosIssued}
      tooltip={
        "Total amount of xGNOS currently issued through GNOS-GNOT staking."
      }
      currency="xGNOS"
    />
    <GovernanceDetailInfo
      title={"Community Pool"}
      value={governanceDetailInfo.communityPool}
      tooltip={
        "Amount of GNOS accumulated in the Community Pool from Emissions."
      }
      currency="GNOS"
    />
    <GovernanceDetailInfo
      title={"Passed Proposals"}
      value={governanceDetailInfo.passedProposals}
      tooltip={"Proposals that were successfully executed."}
    />
    <GovernanceDetailInfo
      title={"Active Proposals"}
      value={governanceDetailInfo.activeProposals}
      tooltip={"Proposals that are currently available for voting."}
    />
  </GovernanceDetailWrapper>
);

export default GovernanceDetail;
