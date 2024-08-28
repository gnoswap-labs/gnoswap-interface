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
  const { isSwitchNetwork, connected, switchNetwork } = useWallet();
  const { openModal } = useConnectWalletModal();

  const [page, setPage] = useState(0);

  const { data: proposalsInfo, isFetching } = useGetProposals({
    isActive: false,
    offset: page,
    limit: 20,
  });

  const handleSelectVote = useCallback(() => {
    if (!connected) {
      openModal();
    } else if (isSwitchNetwork) {
      switchNetwork();
    }
  }, [switchNetwork, openModal, isSwitchNetwork, connected]);

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
        // proposalDetail={createDummyProposalItem()}
        handleSelectVote={handleSelectVote}
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
