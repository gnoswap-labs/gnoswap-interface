import { BalanceDetailInfo } from "@containers/wallet-balance-container/WalletBalanceContainer";
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
      tooltip={"Description of Total xGNOS Issued"}
      currency="xGNOS"
    />
    <GovernanceDetailInfo
      title={"Community Pool"}
      value={governanceDetailInfo.communityPool}
      tooltip={"Description of Community Pool"}
      currency="GNOS"
    />
    <GovernanceDetailInfo
      title={"Passed Proposals"}
      value={governanceDetailInfo.passedProposals}
      tooltip={"Description of Passed Proposals"}
    />
    <GovernanceDetailInfo
      title={"Active Proposals"}
      value={governanceDetailInfo.activeProposals}
      tooltip={"Description of Active Proposals"}
    />
  </GovernanceDetailWrapper>
);

export default GovernanceDetail;
