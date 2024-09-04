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

const MyDelegationContainer: React.FC = () => {
  const { account, connected } = useWallet();
  const { openModal } = useConnectWalletModal();

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
    />
  );
};

export default MyDelegationContainer;
