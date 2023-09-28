import { ProposalDetailProps } from "@containers/proposal-list-container/ProposalListContainer";
import ProposalDetail from "../proposal-detail/ProposalDetail";
import ProposalHeader from "../proposal-header/ProposalHeader";
import { ProposalListWrapper } from "./ProposalList.styles";

interface ProposalListProps {
  proposalList: ProposalDetailProps[];
  isShowCancelled: boolean;
  toggleShowCancelled: () => void;
}

const ProposalList: React.FC<ProposalListProps> = ({
  proposalList,
  toggleShowCancelled,
  isShowCancelled,
}) => (
  <ProposalListWrapper>
    <ProposalHeader
      toggleShowCancelled={toggleShowCancelled}
      isShowCancelled={isShowCancelled}
    />
    {proposalList.map((proposalDetail: ProposalDetailProps) => (
      <ProposalDetail key={proposalDetail.id} proposalDetail={proposalDetail} />
    ))}
  </ProposalListWrapper>
);

export default ProposalList;
