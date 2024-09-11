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
import { useTranslation } from "react-i18next";

interface ProposalListProps {
  breakpoint: DEVICE_TYPE;
  isLoading?: boolean;
  isConnected: boolean;
  connectWallet: () => void;
  isSwitchNetwork: boolean;
  switchNetwork: () => void;
  isShowActiveOnly: boolean;
  address: string;
  toggleIsShowActiveOnly: () => void;
  myVotingWeight: number;
  proposalCreationThreshold: number;
  proposalList: ProposalItemInfo[];
  fetchMore: () => void;
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
  cancelProposal: (id: number) => void;
}

const ProposalList: React.FC<ProposalListProps> = ({
  breakpoint,
  isLoading,
  isConnected,
  connectWallet,
  isSwitchNetwork,
  switchNetwork,
  address,
  isShowActiveOnly,
  toggleIsShowActiveOnly,
  myVotingWeight,
  proposalCreationThreshold,
  proposalList,
  fetchMore,
  selectedProposalId,
  setSelectedProposalId,
  isOpenCreateModal,
  setIsOpenCreateModal,
  proposeTextProposal,
  proposeCommunityPoolSpendProposal,
  proposeParamChnageProposal,
  voteProposal,
  executeProposal,
  cancelProposal,
}) => {
  const { t } = useTranslation();
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
                    address={address}
                    proposalDetail={proposalDetail}
                    onClickCard={() => setSelectedProposalId(proposalDetail.id)}
                    executeProposal={executeProposal}
                    cancelProposal={cancelProposal}
                  />
                );
              }
              return (
                <LastCard
                  key={proposalDetail.id}
                  address={address}
                  proposalDetail={proposalDetail}
                  onClickCard={() => setSelectedProposalId(proposalDetail.id)}
                  executeProposal={executeProposal}
                  cancelProposal={cancelProposal}
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
      {!isLoading && (!proposalList || proposalList.length === 0) && (
        <div className="no-data-found">{t("common:noDataFound")}</div>
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
          connectWallet={connectWallet}
          switchNetwork={switchNetwork}
          voteProposal={voteProposal}
        />
      )}
      {isOpenCreateModal && (
        <CreateProposalModal
          breakpoint={breakpoint}
          setIsOpenCreateModal={setIsOpenCreateModal}
          myVotingWeight={myVotingWeight}
          proposalCreationThreshold={proposalCreationThreshold}
          proposeTextProposal={proposeTextProposal}
          proposeCommunityPoolSpendProposal={proposeCommunityPoolSpendProposal}
          proposeParamChnageProposal={proposeParamChnageProposal}
        />
      )}
    </ProposalListWrapper>
  );
};

export default ProposalList;
