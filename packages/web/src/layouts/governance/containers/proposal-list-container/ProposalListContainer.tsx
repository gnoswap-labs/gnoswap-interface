import React, { useMemo, useState } from "react";
import { useRouter } from "next/router";

import { useWindowSize } from "@hooks/common/use-window-size";
import { useConnectWalletModal } from "@hooks/wallet/ui/use-connect-wallet-modal";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { useGetMyDelegation, useGetProposalParameters, useGetProposals } from "@query/governance";

import { useCreateProposalModal } from "@hooks/governance/ui/use-create-proposal-modal";
import ProposalList from "../../components/proposals-list/ProposalList";
import { useGovernanceTx } from "@hooks/governance/data/use-governance-tx";
import { rawToDisplayAmount } from "@utils/number-utils";
import { GNS_TOKEN, XGNS_TOKEN } from "@common/values/token-constant";

const DEFAULT_PROPOSAL_CREATION_THRESHOLD = 1000 as const;

const ProposalListContainer: React.FC = () => {
  const router = useRouter();
  const { active } = router.query;

  const { breakpoint } = useWindowSize();
  const [isShowActiveOnly, setIsShowActiveOnly] = useState(active === "true");
  const [selectedProposalId, setSelectedProposalId] = useState(0);
  const { isSwitchNetwork, connected, switchNetwork, account } = useWallet();
  const { openModal } = useConnectWalletModal();
  const { openModal: openCreateProposalModal } = useCreateProposalModal();

  const {
    proposeCommunityPoolSpendProposal,
    proposeTextProposal,
    proposeParamChangeProposal,
    voteProposal,
    executeProposal,
    cancelProposal,
  } = useGovernanceTx();

  const { data: proposalParameterInfo, isFetched: isFetchedProposalParameterInfo } = useGetProposalParameters();

  const { data: myDelegationInfo } = useGetMyDelegation({
    address: account?.address || "",
  });

  const {
    data: ProposalsInfo,
    isFetched: isFetchedProposalsInfo,
    hasNextPage,
    fetchNextPage,
    refetch: refetchProposals,
  } = useGetProposals({
    isActive: isShowActiveOnly,
    address: account?.address,
    size: 20,
  });

  const executablePackages = useMemo(() => {
    if (!proposalParameterInfo) {
      return [];
    }

    const allPackages = proposalParameterInfo.packages;
    return allPackages.filter(
      (package_, index) => allPackages.findIndex(p => p.pkgPath === package_.pkgPath) === index,
    );
  }, [proposalParameterInfo?.packages]);

  const executableFunctions = useMemo(() => {
    if (!proposalParameterInfo) {
      return [];
    }

    return proposalParameterInfo.functions;
  }, [proposalParameterInfo?.functions]);

  const proposalCreationThreshold = useMemo(() => {
    if (!proposalParameterInfo) return DEFAULT_PROPOSAL_CREATION_THRESHOLD;

    return (
      rawToDisplayAmount(proposalParameterInfo.proposalCreationThreshold, GNS_TOKEN.decimals) ||
      DEFAULT_PROPOSAL_CREATION_THRESHOLD
    );
  }, [proposalParameterInfo?.proposalCreationThreshold]);

  const fetchNextItems = () => {
    if (hasNextPage) fetchNextPage();
  };

  const toggleIsShowActiveOnly = React.useCallback(() => {
    setIsShowActiveOnly(prev => {
      const newActiveState = !prev;

      router.query.active = newActiveState ? "true" : "false";
      router.replace(
        {
          pathname: router.pathname,
          query: router.query,
        },
        undefined,
        { scroll: false },
      );
      return newActiveState;
    });
  }, [router, setIsShowActiveOnly]);

  return (
    <ProposalList
      breakpoint={breakpoint}
      isLoading={!isFetchedProposalsInfo || !isFetchedProposalParameterInfo}
      isConnected={connected}
      connectWallet={openModal}
      isSwitchNetwork={isSwitchNetwork}
      address={account?.address || ""}
      switchNetwork={switchNetwork}
      isShowActiveOnly={isShowActiveOnly}
      toggleIsShowActiveOnly={toggleIsShowActiveOnly}
      myVotingWeight={rawToDisplayAmount(Number(myDelegationInfo?.votingWeight) || 0, XGNS_TOKEN.decimals)}
      proposalCreationThreshold={proposalCreationThreshold}
      proposalList={ProposalsInfo?.pages.flatMap(item => item.proposals) || []}
      fetchMore={fetchNextItems}
      selectedProposalId={selectedProposalId}
      setSelectedProposalId={setSelectedProposalId}
      openCreateProposalModal={openCreateProposalModal}
      executablePackages={executablePackages}
      executableFunctions={executableFunctions}
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
      proposeParamChangeProposal={(...params) =>
        proposeParamChangeProposal(...params, async () => {
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
