import React, { useState } from "react";

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

  const {
    proposeCommunityPoolSpendProposal,
    proposeTextProposal,
    proposeParamChnageProposal,
    voteProposal,
    executeProposal,
  } = useGovernanceTx();

  const { data: proposalsInfo, isFetching, hasNextPage, fetchNextPage } = useGetProposals({
    isActive: isShowActiveOnly,
    address: account?.address,
    itemsPerPage: 20,
  });

  const fetchNextItems = () => {
    if (hasNextPage) fetchNextPage();
  };

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
      selectedProposalId={selectedProposalId}
      setSelectedProposalId={setSelectedProposalId}
      isOpenCreateModal={isOpenCreateModal}
      setIsOpenCreateModal={setIsOpenCreateModal}
      proposeTextProposal={proposeTextProposal}
      proposeCommunityPoolSpendProposal={proposeCommunityPoolSpendProposal}
      proposeParamChnageProposal={proposeParamChnageProposal}
      voteProposal={voteProposal}
      executeProposal={executeProposal}
    />
  );
};

export default ProposalListContainer;
