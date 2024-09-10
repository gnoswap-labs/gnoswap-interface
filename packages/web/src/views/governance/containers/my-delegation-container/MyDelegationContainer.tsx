import React from "react";

import { useConnectWalletModal } from "@hooks/wallet/use-connect-wallet-modal";
import { useWallet } from "@hooks/wallet/use-wallet";
import {
  useGetDelegatees,
  useGetGovernanceSummary,
  useGetMyDelegation,
} from "@query/governance";
import { nullMyDelegationInfo } from "@repositories/governance";

import MyDelegation from "../../components/my-delegation/MyDelegation";
import { useGovernanceTx } from "@views/governance/hooks/use-governance-tx";

const MyDelegationContainer: React.FC = () => {
  const { account, connected } = useWallet();
  const { openModal } = useConnectWalletModal();
  const { delegateGNS, undelegateGNS, collectUndelegated, collectReward } =
    useGovernanceTx();

  const {
    data: governanceSummaryInfo,
    isFetching: isFetchingGovernanceSummaryInfo,
    refetch: refetchSummary,
  } = useGetGovernanceSummary();
  const {
    data: myDelegationInfo,
    isFetching: isFetchingMyDelegation,
    refetch: refetchMyDelegation,
  } = useGetMyDelegation({
    address: account?.address || "",
  });
  const {
    data: delegatees,
    isFetching: isFetchingDelegatees,
    refetch: refetchDelegatees,
  } = useGetDelegatees();

  return (
    <MyDelegation
      totalDelegatedAmount={governanceSummaryInfo?.totalDelegated || 0}
      myDelegationInfo={myDelegationInfo ?? nullMyDelegationInfo}
      delegatees={delegatees ?? []}
      isLoading={
        (isFetchingGovernanceSummaryInfo ||
          isFetchingMyDelegation ||
          isFetchingDelegatees) &&
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
      collectUndelegated={(...params) =>
        collectUndelegated(...params, async () => {
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
