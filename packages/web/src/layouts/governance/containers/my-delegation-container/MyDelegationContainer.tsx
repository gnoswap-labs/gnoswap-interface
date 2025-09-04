// Todo: Delete
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from "react";

import { useConnectWalletModal } from "@hooks/wallet/ui/use-connect-wallet-modal";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import {
  useGetDelegatees,
  useGetGovernanceSummary,
  useGetMyDelegates,
  useGetMyDelegation,
  useGetMyDelegation2,
  useGetMyUnDelegates,
} from "@query/governance";
import {
  nullMyDelegatesInfo,
  nullMyDelegationInfo,
  nullMyDelegationInfo2,
  nullMyUnDelegatesInfo,
} from "@repositories/governance";

import { useGovernanceTx } from "@hooks/governance/data/use-governance-tx";
import MyDelegation from "../../components/my-delegation/MyDelegation";
import { useTokenData } from "@hooks/token/data/use-token-data";

const MyDelegationContainer: React.FC = () => {
  const { account, connected } = useWallet();
  const { openModal } = useConnectWalletModal();
  const { delegateGNS, undelegateGNS, collectUndelegated, collectReward } = useGovernanceTx();

  const address = React.useMemo(() => {
    return account?.address || "";
  }, [account]);

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
  } = useGetMyDelegation({ address });
  const { data: delegatees, isFetched: isFetchedDelegatees, refetch: refetchDelegatees } = useGetDelegatees();

  const {
    data: myDelegationInfo2,
    isFetched: isFetchedMyDelegation2,
    refetch: refetchMyDelegation2,
  } = useGetMyDelegation2({ address });

  const {
    data: myDelegates,
    isFetched: isFetchedMyDelegates,
    refetch: refetchMyDelegates,
  } = useGetMyDelegates({ address });
  const {
    data: myUnDelegates,
    isFetched: isFetchedMyUnDelegates,
    refetch: refetchMyUnDelegates,
  } = useGetMyUnDelegates({ address });

  return (
    <MyDelegation
      totalDelegatedAmount={governanceSummaryInfo?.totalDelegated || 0}
      apy={governanceSummaryInfo?.apy || 0}
      myDelegationInfo={myDelegationInfo2 ?? nullMyDelegationInfo2}
      myDelegates={myDelegates ?? nullMyDelegatesInfo}
      myUnDelegates={myUnDelegates ?? nullMyUnDelegatesInfo}
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
