// Todo: Delete
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from "react";

import { useConnectWalletModal } from "@hooks/wallet/ui/use-connect-wallet-modal";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import {
  useGetGovernanceSummary2,
  useGetMyDelegates,
  useGetMyDelegation2,
  useGetMyUnDelegates,
  useGetVerifiedDelegates,
} from "@query/governance";
import { nullMyDelegatesInfo, nullMyDelegationInfo2, nullMyUnDelegatesInfo } from "@repositories/governance";

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
  } = useGetGovernanceSummary2();

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

  const {
    data: verifiedDelegates,
    isFetched: isFetchedDelegatees,
    refetch: refetchDelegatees,
  } = useGetVerifiedDelegates();

  const delegatees = React.useMemo(() => {
    if (!verifiedDelegates) return [];

    return verifiedDelegates.delegates;
  }, [verifiedDelegates]);

  return (
    <MyDelegation
      totalDelegatedAmount={Number(governanceSummaryInfo?.delegationInfo.totalDelegationAmount) || 0}
      apy={Number(governanceSummaryInfo?.apy) || 0}
      myDelegationInfo={myDelegationInfo2 ?? nullMyDelegationInfo2}
      myDelegates={myDelegates ?? nullMyDelegatesInfo}
      myUnDelegates={myUnDelegates ?? nullMyUnDelegatesInfo}
      delegatees={delegatees}
      isLoadingCommon={
        (!isFetchedGovernanceSummaryInfo || !isFetchedDelegatees) && (!governanceSummaryInfo || !delegatees)
      }
      isLoadingMyDelegation={!isFetchedMyDelegation2 && !MyDelegation}
      isWalletConnected={connected}
      connectWallet={openModal}
      delegateGNS={(...params) =>
        delegateGNS(...params, async () => {
          await refetchSummary();
          await refetchMyDelegation2();
          await refetchDelegatees();
          updateBalances();
        })
      }
      undelegateGNS={(...params) =>
        undelegateGNS(...params, async () => {
          await refetchSummary();
          await refetchMyDelegation2();
          await refetchDelegatees();
          updateBalances();
        })
      }
      collectUndelegated={(...params) =>
        collectUndelegated(...params, async () => {
          await refetchSummary();
          await refetchDelegatees();
          await refetchMyDelegation2();
          updateBalances();
        })
      }
      collectReward={(...params) =>
        collectReward(...params, async () => {
          await refetchSummary();
          await refetchDelegatees();
          await refetchMyDelegation2();
          updateBalances();
        })
      }
    />
  );
};

export default MyDelegationContainer;
