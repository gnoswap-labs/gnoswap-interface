import { Dispatch, SetStateAction } from "react";

import { ProposalItemInfo } from "@repositories/governance";
import { DEVICE_TYPE } from "@styles/media";
import { ProposalDetailInfo } from "@views/governance/containers/proposal-list-container/ProposalListContainer";

import CreateProposalModal from "./create-proposal-modal/CreateProposalModal";
import ProposalCard from "./proposal-detail/ProposalCard";
import ProposalCardSkeleton from "./proposal-detail/ProposalCardSekeleton";
import ProposalHeader from "./proposal-header/ProposalHeader";
import ViewProposalModal from "./view-proposal-modal/ViewProposalModal";

import { ProposalListWrapper } from "./ProposalList.styles";

interface ProposalListProps {
  isLoading?: boolean;
  isShowActiveOnly: boolean;
  toggleIsShowActiveOnly: () => void;
  proposalList: ProposalItemInfo[];
  isShowProposalModal: boolean;
  breakpoint: DEVICE_TYPE;
  proposalDetail: ProposalDetailInfo;
  setIsShowProposalModal: Dispatch<SetStateAction<boolean>>;
  onClickProposalDetail: (id: string) => void;
  isShowCreateProposal: boolean;
  setIsShowCreateProposal: Dispatch<SetStateAction<boolean>>;
  isConnected: boolean;
  isSwitchNetwork: boolean;
  handleSelectVote: () => void;
}

const ProposalList: React.FC<ProposalListProps> = ({
  isLoading,
  isShowActiveOnly,
  toggleIsShowActiveOnly,
  proposalList,
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
}) => (
  <ProposalListWrapper>
    <ProposalHeader
      isShowActiveOnly={isShowActiveOnly}
      toggleIsShowActiveOnly={toggleIsShowActiveOnly}
      setIsShowCreateProposal={setIsShowCreateProposal}
      isDisabledCreateButton={!isConnected || !isSwitchNetwork}
    />
    {isLoading ? (
      Array.from({ length: 3 }).map((_, idx) => (
        <ProposalCardSkeleton key={`skeleton-${idx}`} />
      ))
    ) : (
      <>
        {proposalList.map((proposalDetail: ProposalItemInfo) => (
          <ProposalCard
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
