import React from "react";
import { useInvalidateQueries } from "@hooks/common/use-invalidate-queries";
import { QUERY_KEY } from "@query/query-keys";

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
  const { invalidateQueryKey } = useInvalidateQueries();

  const address = React.useMemo(() => {
    return account?.address || "";
  }, [account]);

  const { updateBalances } = useTokenData(true);
  const { data: governanceSummaryInfo, isFetched: isFetchedGovernanceSummaryInfo } = useGetGovernanceSummary();

  const { data: myDelegationInfo, isFetched: isFetchedMyDelegation } = useGetMyDelegation({ address });

  const { data: myDelegates } = useGetMyDelegates({ address });
  const { data: myUnDelegates } = useGetMyUnDelegates({ address });

  const { data: verifiedDelegates, isFetched: isFetchedDelegatees } = useGetVerifiedDelegates();

  const delegatees = React.useMemo(() => {
    if (!verifiedDelegates) return [];

    return verifiedDelegates.delegates;
  }, [verifiedDelegates]);

  const refreshGovernance = async () => {
    await invalidateQueryKey("Governance Delegation", [
      [QUERY_KEY.governanceSummary],
      [QUERY_KEY.governanceMyDelegation],
      [QUERY_KEY.governanceVerifiedDelegates],
      [QUERY_KEY.governanceMyDelegates],
      [QUERY_KEY.governanceMyUnDelegates],
    ]);
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
      isLoadingMyDelegation={!isFetchedMyDelegation && !myDelegationInfo}
      isWalletConnected={connected}
      connectWallet={openModal}
      isOpenDelegateModal={isOpenDelegateModal}
      setIsOpenDelegateModal={setIsOpenDelegateModal}
      delegateGNS={(...params) => delegateGNS(...params, refreshGovernance)}
      undelegateGNS={(...params) => undelegateGNS(...params, refreshGovernance)}
      collectUndelegated={(...params) => collectUndelegated(...params, refreshGovernance)}
      collectReward={(...params) => collectReward(...params, refreshGovernance)}
    />
  );
};

export default MyDelegationContainer;
