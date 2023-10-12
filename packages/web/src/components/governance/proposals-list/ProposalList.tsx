import { ProposalDetailProps } from "@containers/proposal-list-container/ProposalListContainer";
import { DEVICE_TYPE } from "@styles/media";
import ProposalDetail from "../proposal-detail/ProposalDetail";
import ProposalHeader from "../proposal-header/ProposalHeader";
import ViewProposalModal from "../view-proposal-modal/ViewProposalModal";
import { ProposalListWrapper } from "./ProposalList.styles";
import { Dispatch, SetStateAction } from "react";
interface ProposalListProps {
  proposalList: ProposalDetailProps[];
  isShowCancelled: boolean;
  toggleShowCancelled: () => void;
  isShowProposalModal: boolean;
  breakpoint: DEVICE_TYPE;
  proposalDetail: ProposalDetailProps;
  setIsShowProposalModal: Dispatch<SetStateAction<boolean>>;
  onClickProposalDetail: (id: string) => void;
}

const ProposalList: React.FC<ProposalListProps> = ({
  proposalList,
  toggleShowCancelled,
  isShowCancelled,
  isShowProposalModal,
  breakpoint,
  proposalDetail,
  setIsShowProposalModal,
  onClickProposalDetail,
}) => (
  <ProposalListWrapper>
    <ProposalHeader
      toggleShowCancelled={toggleShowCancelled}
      isShowCancelled={isShowCancelled}
    />
    {proposalList.map((proposalDetail: ProposalDetailProps) => (
      <ProposalDetail
        key={proposalDetail.id}
        proposalDetail={proposalDetail}
        onClickProposalDetail={onClickProposalDetail}
      />
    ))}
    {isShowProposalModal && (
      <ViewProposalModal
        breakpoint={breakpoint}
        proposalDetail={proposalDetail}
        setIsShowProposalModal={setIsShowProposalModal}
      />
    )}
  </ProposalListWrapper>
);

export default ProposalList;
