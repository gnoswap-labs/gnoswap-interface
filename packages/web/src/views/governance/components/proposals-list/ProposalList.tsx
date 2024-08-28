import { Dispatch, SetStateAction } from "react";

import { nullProposalItemInfo, ProposalItemInfo } from "@repositories/governance";
import { DEVICE_TYPE } from "@styles/media";

import CreateProposalModal from "./create-proposal-modal/CreateProposalModal";
import ProposalCard from "./proposal-card/ProposalCard";
import ProposalCardSkeleton from "./proposal-card/ProposalCardSekeleton";
import ProposalHeader from "./proposal-header/ProposalHeader";
import ViewProposalModal from "./view-proposal-modal/ViewProposalModal";

import { ProposalListWrapper } from "./ProposalList.styles";

interface ProposalListProps {
  isLoading?: boolean;
  isShowActiveOnly: boolean;
  toggleIsShowActiveOnly: () => void;
  // proposalDetail: ProposalItemInfo;
  proposalList: ProposalItemInfo[];
  isConnected: boolean;
  isSwitchNetwork: boolean;
  handleSelectVote: () => void;
  breakpoint: DEVICE_TYPE;
  selectedProposalId: number;
  setSelectedProposalId: Dispatch<SetStateAction<number>>;
  isOpenCreateModal: boolean;
  setIsOpenCreateModal: Dispatch<SetStateAction<boolean>>;
}

const ProposalList: React.FC<ProposalListProps> = ({
  isLoading,
  isShowActiveOnly,
  toggleIsShowActiveOnly,
  proposalList,
  breakpoint,
  // proposalDetail,
  selectedProposalId,
  setSelectedProposalId,
  isOpenCreateModal,
  setIsOpenCreateModal,
  isConnected,
  isSwitchNetwork,
  handleSelectVote,
}) => (
  <ProposalListWrapper>
    <ProposalHeader
      isShowActiveOnly={isShowActiveOnly}
      toggleIsShowActiveOnly={toggleIsShowActiveOnly}
      setIsOpenCreateModal={setIsOpenCreateModal}
      isDisabledCreateButton={!isConnected || isSwitchNetwork}
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
            onClickCard={() => setSelectedProposalId(proposalDetail.id)}
          />
        ))}
      </>
    )}

    {selectedProposalId !== 0 && (
      <ViewProposalModal
        breakpoint={breakpoint}
        proposalDetail={
          proposalList.find(item => item.id === selectedProposalId - 1) ||
          nullProposalItemInfo
        }
        setSelectedProposalId={setSelectedProposalId}
        isConnected={isConnected}
        isSwitchNetwork={isSwitchNetwork}
        handleSelectVote={handleSelectVote}
      />
    )}
    {isOpenCreateModal && (
      <CreateProposalModal
        breakpoint={breakpoint}
        setIsOpenCreateModal={setIsOpenCreateModal}
      />
    )}
  </ProposalListWrapper>
);

export default ProposalList;
