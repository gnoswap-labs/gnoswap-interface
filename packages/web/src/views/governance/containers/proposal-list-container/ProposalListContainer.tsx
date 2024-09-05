import React, { useCallback, useState } from "react";

import { useWindowSize } from "@hooks/common/use-window-size";
import { useConnectWalletModal } from "@hooks/wallet/use-connect-wallet-modal";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useGetProposals } from "@query/governance";

import ProposalList from "../../components/proposals-list/ProposalList";
import { useGovernanceTx } from "../../hooks/use-governance-tx";

const ProposalListContainer: React.FC = () => {
  const { breakpoint } = useWindowSize();
  const [isShowActiveOnly, setIsShowActiveOnly] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState(0);
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const { isSwitchNetwork, connected, switchNetwork, account } = useWallet();
  const { openModal } = useConnectWalletModal();

  const { proposeCommunityPoolSpendProposal, proposeTextProposal, proposeParamChnageProposal} = useGovernanceTx();

  const { data: proposalsInfo, isFetching, hasNextPage, fetchNextPage } = useGetProposals({
    isActive: isShowActiveOnly,
    address: account?.address,
    limit: 20,
  });

  const fetchNextItems = () => {
    if (hasNextPage) fetchNextPage();
  };

  const handleVote = useCallback((voteYes: boolean) => {
    // vote yes
    console.log("vote to ", voteYes);
  }, []);

  return (
    <ProposalList
      isLoading={isFetching}
      isConnected={connected}
      connectWallet={openModal}
      isSwitchNetwork={isSwitchNetwork}
      switchNetwork={switchNetwork}
      isShowActiveOnly={isShowActiveOnly}
      breakpoint={breakpoint}
      toggleIsShowActiveOnly={() => setIsShowActiveOnly(a => !a)}
      proposalList={proposalsInfo?.pages.flatMap(item => item.proposals) || []}
      fetchMore={fetchNextItems}
      handleVote={handleVote}
      selectedProposalId={selectedProposalId}
      setSelectedProposalId={setSelectedProposalId}
      isOpenCreateModal={isOpenCreateModal}
      setIsOpenCreateModal={setIsOpenCreateModal}
      proposeTextProposal={proposeTextProposal}
      proposeCommunityPoolSpendProposal={proposeCommunityPoolSpendProposal}
      proposeParamChnageProposal={proposeParamChnageProposal}
    />
  );
};

export default ProposalListContainer;
