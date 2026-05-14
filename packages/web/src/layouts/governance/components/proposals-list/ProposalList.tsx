import React, { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";

import withIntersection from "@components/hoc/with-intersection";
import { ProposalItemInfo } from "@repositories/governance";
import { DEVICE_TYPE } from "@styles/media";

import ProposalCard from "./proposal-card/ProposalCard";
import ProposalCardSkeleton from "./proposal-card/ProposalCardSekeleton";
import ProposalHeader from "./proposal-header/ProposalHeader";
import ViewProposalModal from "./view-proposal-modal/ViewProposalModal";

import { CreateProposalModalOpenOption } from "@hooks/governance/ui/use-create-proposal-modal";
import { isQuorumReached } from "@utils/governance-utils";
import { ProposalListWrapper } from "./ProposalList.styles";

export interface ProposalListProps {
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
  openCreateProposalModal: (options: CreateProposalModalOpenOption) => void;
  executablePackages: {
    pkgName: string;
    pkgPath: string;
  }[];
  executableFunctions: {
    pkgPath: string;
    funcName: string;
    paramNum: number;
  }[];
  proposeTextProposal: (title: string, description: string) => void;
  proposeCommunityPoolSpendProposal: (
    title: string,
    description: string,
    tokenPath: string,
    toAddress: string,
    amount: string,
  ) => void;
  proposeParamChangeProposal: (
    title: string,
    description: string,
    variables: {
      pkgPath: string;
      func: string;
      param: string;
    }[],
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
  executablePackages,
  executableFunctions,
  openCreateProposalModal,
  proposeTextProposal,
  proposeCommunityPoolSpendProposal,
  proposeParamChangeProposal,
  voteProposal,
  executeProposal,
  cancelProposal,
}) => {
  const { t } = useTranslation();
  const LastCard = withIntersection(ProposalCard, fetchMore);

  const onClickCreateProposal = () => {
    openCreateProposalModal({
      breakpoint: breakpoint,
      myVotingWeight: myVotingWeight,
      proposalCreationThreshold: proposalCreationThreshold,
      executablePackages: executablePackages,
      executableFunctions: executableFunctions,
      proposeTextProposal: proposeTextProposal,
      proposeCommunityPoolSpendProposal: proposeCommunityPoolSpendProposal,
      proposeParamChangeProposal: proposeParamChangeProposal,
    });
  };

  const getTooltipTextI18nKey = React.useCallback(
    (status: string, isMajorityVoted: boolean, yesVotes: number, noVotes: number) => {
      if (isMajorityVoted) {
        switch (status) {
          case "ACTIVE":
            if (yesVotes >= noVotes) {
              return "proposal.tooltip.passed";
            } else {
              return "proposal.tooltip.rejected";
            }
          case "PASSED":
          case "EXECUTABLE":
          case "EXECUTED":
          case "EXPIRED":
            return "proposal.tooltip.passed";
          case "REJECTED":
            return "proposal.tooltip.rejected";
          default:
            return "proposal.tooltip.executed";
        }
      }

      return "proposal.tooltip.executed";
    },
    [],
  );

  const calculateIsMajorityVoted = (proposalDetail: ProposalItemInfo) => {
    const { votingInfo } = proposalDetail;
    return isQuorumReached(votingInfo);
  };

  return (
    <ProposalListWrapper>
      <ProposalHeader
        isShowActiveOnly={isShowActiveOnly}
        toggleIsShowActiveOnly={toggleIsShowActiveOnly}
        onClickCreateProposal={onClickCreateProposal}
        isDisabledCreateButton={!isConnected || isSwitchNetwork}
      />
      {proposalList && proposalList.length > 0 && (
        <>
          {proposalList.map((proposalDetail: ProposalItemInfo, index: number) => {
            const Card = index < proposalList.length - 1 ? ProposalCard : LastCard;
            const isMajorityVoted = calculateIsMajorityVoted(proposalDetail);
            return (
              <Card
                key={proposalDetail.id}
                address={address}
                breakpoint={breakpoint}
                proposalDetail={proposalDetail}
                onClickCard={() => setSelectedProposalId(proposalDetail.id)}
                executeProposal={executeProposal}
                cancelProposal={cancelProposal}
                getTooltipTextI18nKey={getTooltipTextI18nKey}
                isMajorityVoted={isMajorityVoted}
              />
            );
          })}
        </>
      )}
      {isLoading && Array.from({ length: 3 }).map((_, idx) => <ProposalCardSkeleton key={`skeleton-${idx}`} />)}
      {!isLoading && (!proposalList || proposalList.length === 0) && (
        <div className="no-data-found">{t("common:noProposalFound")}</div>
      )}
      {selectedProposalId !== 0 && (
        <ViewProposalModal
          address={address}
          proposalId={selectedProposalId}
          breakpoint={breakpoint}
          setIsModalOpen={(isOpen: boolean) => setSelectedProposalId(isOpen ? selectedProposalId : 0)}
          isConnected={isConnected}
          isSwitchNetwork={isSwitchNetwork}
          connectWallet={connectWallet}
          switchNetwork={switchNetwork}
          voteProposal={voteProposal}
          getTooltipTextI18nKey={getTooltipTextI18nKey}
        />
      )}
    </ProposalListWrapper>
  );
};

export default ProposalList;
