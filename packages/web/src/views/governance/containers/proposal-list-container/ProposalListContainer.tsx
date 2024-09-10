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
    cancelProposal,
  } = useGovernanceTx();

  const {
    data: proposalsInfo,
    isFetching,
    hasNextPage,
    fetchNextPage,
    refetch: refetchProposals,
  } = useGetProposals({
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
      address={account?.address || ""}
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
      proposeTextProposal={(...params) =>
        proposeTextProposal(...params, async () => {
          await refetchProposals();
        })
      }
      proposeCommunityPoolSpendProposal={(...params) =>
        proposeCommunityPoolSpendProposal(...params, async () => {
          await refetchProposals();
        })
      }
      proposeParamChnageProposal={(...params) =>
        proposeParamChnageProposal(...params, async () => {
          await refetchProposals();
        })
      }
      voteProposal={(...params) =>
        voteProposal(...params, async () => {
          await refetchProposals();
        })
      }
      executeProposal={(...params) =>
        executeProposal(...params, async () => {
          await refetchProposals();
        })
      }
      cancelProposal={(...params) =>
        cancelProposal(...params, async () => {
          await refetchProposals();
        })
      }
    />
  );
};

export default ProposalListContainer;
