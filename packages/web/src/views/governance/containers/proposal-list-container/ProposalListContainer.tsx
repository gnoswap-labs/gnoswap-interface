import React, { useCallback, useState } from "react";

import { useWindowSize } from "@hooks/common/use-window-size";
import { useConnectWalletModal } from "@hooks/wallet/use-connect-wallet-modal";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useGetProposals } from "@query/governance/use-get-proposals";

import ProposalList from "../../components/proposals-list/ProposalList";

const ProposalListContainer: React.FC = () => {
  const { breakpoint } = useWindowSize();
  const [isShowActiveOnly, setIsShowActiveOnly] = useState(false);
  const [selectedProposalId, setSelectedProposalId] = useState(0);
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const { isSwitchNetwork, connected, switchNetwork, account } = useWallet();
  const { openModal } = useConnectWalletModal();

  const [page, setPage] = useState(0);

  const { data: proposalsInfo, isFetching } = useGetProposals({
    isActive: isShowActiveOnly,
    address: account?.address,
    offset: page,
    limit: 20,
  });

    const handleVote = useCallback((voteYes: boolean) => {
      // vote yes
      console.log("vote to ", voteYes);
    }, []);

  return (
    <>
      <ProposalList
        isLoading={isFetching}
        isConnected={connected}
        isSwitchNetwork={isSwitchNetwork}
        isShowActiveOnly={isShowActiveOnly}
        breakpoint={breakpoint}
        toggleIsShowActiveOnly={() => setIsShowActiveOnly(a => !a)}
        proposalList={proposalsInfo?.proposals || []}
        handleVote={handleVote}
        connectWallet={openModal}
        switchNetwork={switchNetwork}
        selectedProposalId={selectedProposalId}
        setSelectedProposalId={setSelectedProposalId}
        isOpenCreateModal={isOpenCreateModal}
        setIsOpenCreateModal={setIsOpenCreateModal}
      />
      {(proposalsInfo?.pageInfo.currentPage || 0) !== 0 && (
        <div onClick={() => setPage(page - 1)}> Prev Page </div>
      )}
      {(proposalsInfo?.pageInfo.totalPages || 0) >
        (proposalsInfo?.pageInfo.currentPage || 0) + 1 && (
        <div onClick={() => setPage(page + 1)}> Next Page </div>
      )}
    </>
  );
};

export default ProposalListContainer;
