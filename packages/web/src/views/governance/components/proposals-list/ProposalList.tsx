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
  proposalList: ProposalItemInfo[];
  isConnected: boolean;
  isSwitchNetwork: boolean;
  handleVote: (voteYes: boolean) => void;
  connectWallet: () => void;
  switchNetwork: () => void;
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
  selectedProposalId,
  setSelectedProposalId,
  connectWallet,
  switchNetwork,
  isOpenCreateModal,
  setIsOpenCreateModal,
  isConnected,
  isSwitchNetwork,
  handleVote,
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
          proposalList.find(item => item.id === selectedProposalId) ||
          nullProposalItemInfo
        }
        setSelectedProposalId={setSelectedProposalId}
        isConnected={isConnected}
        isSwitchNetwork={isSwitchNetwork}
        handleVote={handleVote}
        connectWallet={connectWallet}
        switchNetwork={switchNetwork}
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
