import React from "react";

import { useConnectWalletModal } from "@hooks/wallet/use-connect-wallet-modal";
import { useWallet } from "@hooks/wallet/use-wallet";
import {
  useGetDelegatees,
  useGetGovernanceSummary,
  useGetMyDelegation,
} from "@query/governance";
import { nullMyDelegationInfo } from "@repositories/governance";

import { useGovernanceTx } from "@views/governance/hooks/use-governance-tx";
import MyDelegation from "../../components/my-delegation/MyDelegation";

const MyDelegationContainer: React.FC = () => {
  const { account, connected } = useWallet();
  const { openModal } = useConnectWalletModal();
  const { delegateGNS, undelegateGNS, collectUndelegated, collectReward } =
    useGovernanceTx();

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
  const {
    data: delegatees,
    isFetched: isFetchedDelegatees,
    refetch: refetchDelegatees,
  } = useGetDelegatees();

  return (
    <MyDelegation
      totalDelegatedAmount={governanceSummaryInfo?.totalDelegated || 0}
      apy={governanceSummaryInfo?.apy || 0}
      myDelegationInfo={myDelegationInfo ?? nullMyDelegationInfo}
      delegatees={delegatees ?? []}
      isLoading={
        (!isFetchedGovernanceSummaryInfo ||
          !isFetchedMyDelegation ||
          !isFetchedDelegatees) &&
        (!governanceSummaryInfo || !myDelegationInfo || !delegatees)
      }
      isWalletConnected={connected}
      connectWallet={openModal}
      delegateGNS={(...params) =>
        delegateGNS(...params, async () => {
          await refetchSummary();
          await refetchMyDelegation();
          await refetchDelegatees();
        })
      }
      undelegateGNS={(...params) =>
        undelegateGNS(...params, async () => {
          await refetchSummary();
          await refetchMyDelegation();
          await refetchDelegatees();
        })
      }
      collectUndelegated={() =>
        collectUndelegated(async () => {
          await refetchSummary();
          await refetchMyDelegation();
        })
      }
      collectReward={(...params) =>
        collectReward(...params, async () => {
          await refetchSummary();
          await refetchMyDelegation();
        })
      }
    />
  );
};

export default MyDelegationContainer;
