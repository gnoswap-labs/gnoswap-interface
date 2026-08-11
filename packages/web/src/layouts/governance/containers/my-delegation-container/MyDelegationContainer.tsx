import React from "react";

import { useConnectWalletModal } from "@hooks/wallet/ui/use-connect-wallet-modal";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import {
  useGetGovernanceSummary,
  useGetMyDelegates,
  useGetMyDelegation,
  useGetMyUnDelegates,
  useGetVerifiedDelegates,
} from "@query/governance";
import { nullMyDelegatesInfo, nullMyDelegationInfo, nullMyUnDelegatesInfo } from "@repositories/governance";

import { useGovernanceTx } from "@hooks/governance/data/use-governance-tx";
import MyDelegation from "../../components/my-delegation/MyDelegation";
import { useTokenData } from "@hooks/token/data/use-token-data";

interface MyDelegationContainerProps {
  isOpenDelegateModal: boolean;
  setIsOpenDelegateModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const MyDelegationContainer: React.FC<MyDelegationContainerProps> = ({
  isOpenDelegateModal,
  setIsOpenDelegateModal,
}) => {
  const { account, connected } = useWallet();
  const { openModal } = useConnectWalletModal();
  const { delegateGNS, undelegateGNS, collectUndelegated, collectReward } = useGovernanceTx();

  const address = React.useMemo(() => {
    return account?.address || "";
  }, [account]);

  const { updateBalances } = useTokenData(true);
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

  const { data: myDelegates, refetch: refetchMyDelegates } = useGetMyDelegates({ address });
  const { data: myUnDelegates, refetch: refetchMyUnDelegates } = useGetMyUnDelegates({ address });

  const {
    data: verifiedDelegates,
    isFetched: isFetchedDelegatees,
    refetch: refetchDelegatees,
  } = useGetVerifiedDelegates();

  const delegatees = React.useMemo(() => {
    if (!verifiedDelegates) return [];

    return verifiedDelegates.delegates;
  }, [verifiedDelegates]);

  const refetch = async () => {
    await refetchSummary();
    await refetchMyDelegation();
    await refetchDelegatees();
    await refetchMyDelegates();
    await refetchMyUnDelegates();
    updateBalances();
  };

  return (
    <MyDelegation
      totalDelegatedAmount={Number(governanceSummaryInfo?.delegationInfo.totalDelegationAmount) || 0}
      apy={Number(governanceSummaryInfo?.apy) || 0}
      myDelegationInfo={myDelegationInfo ?? nullMyDelegationInfo}
      myDelegates={myDelegates ?? nullMyDelegatesInfo}
      myUnDelegates={myUnDelegates ?? nullMyUnDelegatesInfo}
      delegatees={delegatees}
      isLoadingCommon={
        (!isFetchedGovernanceSummaryInfo || !isFetchedDelegatees) && (!governanceSummaryInfo || !delegatees)
      }
      isLoadingMyDelegation={!isFetchedMyDelegation && !MyDelegation}
      isWalletConnected={connected}
      connectWallet={openModal}
      isOpenDelegateModal={isOpenDelegateModal}
      setIsOpenDelegateModal={setIsOpenDelegateModal}
      delegateGNS={(...params) =>
        delegateGNS(...params, async () => {
          refetch();
          updateBalances();
        })
      }
      undelegateGNS={(...params) =>
        undelegateGNS(...params, async () => {
          refetch();
          updateBalances();
        })
      }
      collectUndelegated={(...params) =>
        collectUndelegated(...params, async () => {
          refetch();
          updateBalances();
        })
      }
      collectReward={(...params) =>
        collectReward(...params, async () => {
          refetch();
          updateBalances();
        })
      }
    />
  );
};

export default MyDelegationContainer;
