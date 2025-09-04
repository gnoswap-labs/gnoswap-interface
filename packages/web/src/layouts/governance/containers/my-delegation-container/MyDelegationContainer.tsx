// Todo: Delete
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from "react";

import { useConnectWalletModal } from "@hooks/wallet/ui/use-connect-wallet-modal";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { useGetDelegatees, useGetGovernanceSummary, useGetMyDelegation, useGetMyDelegation2 } from "@query/governance";
import { nullMyDelegationInfo, nullMyDelegationInfo2 } from "@repositories/governance";

import { useGovernanceTx } from "@hooks/governance/data/use-governance-tx";
import MyDelegation from "../../components/my-delegation/MyDelegation";
import { useTokenData } from "@hooks/token/data/use-token-data";

const MyDelegationContainer: React.FC = () => {
  const { account, connected } = useWallet();
  const { openModal } = useConnectWalletModal();
  const { delegateGNS, undelegateGNS, collectUndelegated, collectReward } = useGovernanceTx();

  const { updateBalances } = useTokenData();
  const {
    data: governanceSummaryInfo,
    isFetched: isFetchedGovernanceSummaryInfo,
    refetch: refetchSummary,
  } = useGetGovernanceSummary();
  const {
    data: myDelegationInfo,
    isFetched: isFetchedMyDelegation,
    refetch: refetchMyDelegation,
  } = useGetMyDelegation({
    address: account?.address || "",
  });
  const { data: delegatees, isFetched: isFetchedDelegatees, refetch: refetchDelegatees } = useGetDelegatees();

  const {
    data: myDelegationInfo2,
    isFetched: isFetchedMyDelegation2,
    refetch: refetchMyDelegation2,
  } = useGetMyDelegation2({
    address: account?.address || "",
  });

  return (
    <MyDelegation
      totalDelegatedAmount={governanceSummaryInfo?.totalDelegated || 0}
      apy={governanceSummaryInfo?.apy || 0}
      myDelegationInfo={myDelegationInfo2 ?? nullMyDelegationInfo2}
      delegatees={delegatees ?? []}
      isLoadingCommon={
        (!isFetchedGovernanceSummaryInfo || !isFetchedDelegatees) && (!governanceSummaryInfo || !delegatees)
      }
      isLoadingMyDelegation={!isFetchedMyDelegation && !MyDelegation}
      isWalletConnected={connected}
      connectWallet={openModal}
      delegateGNS={(...params) =>
        delegateGNS(...params, async () => {
          await refetchSummary();
          await refetchMyDelegation();
          await refetchDelegatees();
          updateBalances();
        })
      }
      undelegateGNS={(...params) =>
        undelegateGNS(...params, async () => {
          await refetchSummary();
          await refetchMyDelegation();
          await refetchDelegatees();
          updateBalances();
        })
      }
      collectUndelegated={(...params) =>
        collectUndelegated(...params, async () => {
          await refetchSummary();
          await refetchDelegatees();
          await refetchMyDelegation();
          updateBalances();
        })
      }
      collectReward={(...params) =>
        collectReward(...params, async () => {
          await refetchSummary();
          await refetchDelegatees();
          await refetchMyDelegation();
          updateBalances();
        })
      }
    />
  );
};

export default MyDelegationContainer;
