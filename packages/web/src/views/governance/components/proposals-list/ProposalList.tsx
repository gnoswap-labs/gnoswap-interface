import { Dispatch, SetStateAction } from "react";

import withIntersection from "@components/hoc/with-intersection";
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
  isConnected: boolean;
  connectWallet: () => void;
  isSwitchNetwork: boolean;
  switchNetwork: () => void;
  isShowActiveOnly: boolean;
  toggleIsShowActiveOnly: () => void;
  proposalList: ProposalItemInfo[];
  fetchMore: () => void;
  breakpoint: DEVICE_TYPE;
  selectedProposalId: number;
  setSelectedProposalId: Dispatch<SetStateAction<number>>;
  isOpenCreateModal: boolean;
  setIsOpenCreateModal: Dispatch<SetStateAction<boolean>>;
  proposeTextProposal: (title: string, description: string) => void;
  proposeCommunityPoolSpendProposal: (
    title: string,
    description: string,
    tokenPath: string,
    toAddress: string,
    amount: string,
  ) => void;
  proposeParamChnageProposal: (
    title: string,
    description: string,
    pkgPath: string,
    functionName: string,
    param: string,
  ) => void;
  voteProposal: (proposalId: number, voteYes: boolean) => void;
  executeProposal: (id: number) => void;
}

const ProposalList: React.FC<ProposalListProps> = ({
  isLoading,
  isConnected,
  connectWallet,
  isSwitchNetwork,
  switchNetwork,
  isShowActiveOnly,
  toggleIsShowActiveOnly,
  proposalList,
  fetchMore,
  breakpoint,
  selectedProposalId,
  setSelectedProposalId,
  isOpenCreateModal,
  setIsOpenCreateModal,
  proposeTextProposal,
  proposeCommunityPoolSpendProposal,
  proposeParamChnageProposal,
  voteProposal,
  executeProposal,
}) => {
  const LastCard = withIntersection(ProposalCard, fetchMore);

  return (
    <ProposalListWrapper>
      <ProposalHeader
        isShowActiveOnly={isShowActiveOnly}
        toggleIsShowActiveOnly={toggleIsShowActiveOnly}
        setIsOpenCreateModal={setIsOpenCreateModal}
        isDisabledCreateButton={!isConnected || isSwitchNetwork}
      />
      {proposalList && proposalList.length > 0 && (
        <>
          {proposalList.map(
            (proposalDetail: ProposalItemInfo, index: number) => {
              if (index < proposalList.length - 1) {
                return (
                  <ProposalCard
                    key={proposalDetail.id}
                    proposalDetail={proposalDetail}
                    onClickCard={() => setSelectedProposalId(proposalDetail.id)}
                    executeProposal={executeProposal}
                  />
                );
              }
              return (
                <LastCard
                  key={proposalDetail.id}
                  proposalDetail={proposalDetail}
                  onClickCard={() => setSelectedProposalId(proposalDetail.id)}
                  executeProposal={executeProposal}
                />
              );
            },
          )}
        </>
      )}
      {isLoading &&
        Array.from({ length: 3 }).map((_, idx) => (
          <ProposalCardSkeleton key={`skeleton-${idx}`} />
        ))}

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
          connectWallet={connectWallet}
          switchNetwork={switchNetwork}
          voteProposal={voteProposal}
        />
      )}
      {isOpenCreateModal && (
        <CreateProposalModal
          breakpoint={breakpoint}
          setIsOpenCreateModal={setIsOpenCreateModal}
          proposeTextProposal={proposeTextProposal}
          proposeCommunityPoolSpendProposal={proposeCommunityPoolSpendProposal}
          proposeParamChnageProposal={proposeParamChnageProposal}
        />
      )}
    </ProposalListWrapper>
  );
};

export default ProposalList;
