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
  const { delegateGNS } = useGovernanceTx();

  const {
    data: governanceSummaryInfo,
    isFetching: isFetchingGovernanceSummaryInfo,
  } = useGetGovernanceSummary();
  const { data: myDelegationInfo, isFetching: isFetchingMyDelegation } =
    useGetMyDelegation({
      address: account?.address || "",
    });
  const { data: delegatees, isFetching: isFetchingDelegatees } =
    useGetDelegatees();

  return (
    <MyDelegation
      totalDelegatedAmount={governanceSummaryInfo?.totalDeligated || 0}
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
      delegateGNS={delegateGNS}
    />
  );
};

export default MyDelegationContainer;
