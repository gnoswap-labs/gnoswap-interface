import { ProposalDetailProps } from "@containers/proposal-list-container/ProposalListContainer";
import { DEVICE_TYPE } from "@styles/media";
import ProposalDetail from "../proposal-detail/ProposalDetail";
import ProposalHeader from "../proposal-header/ProposalHeader";
import ViewProposalModal from "../view-proposal-modal/ViewProposalModal";
import { ProposalListWrapper } from "./ProposalList.styles";
import { Dispatch, SetStateAction } from "react";
import CreateProposalModal from "../create-proposal-modal/CreateProposalModal";
import ProposalDetailSkeleton from "../proposal-detail/ProposalDetailSekeleton";
interface ProposalListProps {
  proposalList: ProposalDetailProps[];
  isShowCancelled: boolean;
  toggleShowCancelled: () => void;
  isShowProposalModal: boolean;
  breakpoint: DEVICE_TYPE;
  proposalDetail: ProposalDetailProps;
  setIsShowProposalModal: Dispatch<SetStateAction<boolean>>;
  onClickProposalDetail: (id: string) => void;
  isShowCreateProposal: boolean;
  setIsShowCreateProposal: Dispatch<SetStateAction<boolean>>;
  isConnected: boolean;
  isSwitchNetwork: boolean;
  handleSelectVote: () => void;
  loading?: boolean;
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
  isShowCreateProposal,
  setIsShowCreateProposal,
  isConnected,
  isSwitchNetwork,
  handleSelectVote,
  loading,
}) => (
  <ProposalListWrapper>
    <ProposalHeader
      toggleShowCancelled={toggleShowCancelled}
      isShowCancelled={isShowCancelled}
      setIsShowCreateProposal={setIsShowCreateProposal}
      isConnected={isConnected}
      isSwitchNetwork={isSwitchNetwork}
    />
    {loading ? (
      Array.from({ length: 3 }).map((_, idx) => (
        <ProposalDetailSkeleton key={`skeleton-${idx}`} />
      ))
    ) : (
      <>
        {proposalList.map((proposalDetail: ProposalDetailProps) => (
          <ProposalDetail
            key={proposalDetail.id}
            proposalDetail={proposalDetail}
            onClickProposalDetail={onClickProposalDetail}
          />
        ))}
      </>
    )}

    {isShowProposalModal && (
      <ViewProposalModal
        breakpoint={breakpoint}
        proposalDetail={proposalDetail}
        setIsShowProposalModal={setIsShowProposalModal}
        isConnected={isConnected}
        isSwitchNetwork={isSwitchNetwork}
        handleSelectVote={handleSelectVote}
      />
    )}
    {isShowCreateProposal && (
      <CreateProposalModal
        breakpoint={breakpoint}
        setIsShowCreateProposal={setIsShowCreateProposal}
      />
    )}
  </ProposalListWrapper>
);

export default ProposalList;
