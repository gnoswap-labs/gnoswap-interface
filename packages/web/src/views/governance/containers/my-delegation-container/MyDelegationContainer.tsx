import React from "react";

import { useConnectWalletModal } from "@hooks/wallet/use-connect-wallet-modal";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useGetMyDelegation } from "@query/governance";
import { nullMyDelegationInfo } from "@repositories/governance";

import MyDelegation from "../../components/my-delegation/MyDelegation";

const MyDelegationContainer: React.FC = () => {
  const { account, connected } = useWallet();
  const { openModal } = useConnectWalletModal();

  const { data: myDelegationInfo, isFetching } = useGetMyDelegation({
    address: account?.address || "",
  });

  return (
    <MyDelegation
      myDelegationInfo={myDelegationInfo ?? nullMyDelegationInfo}
      isLoading={isFetching && !myDelegationInfo}
      isWalletConnected={connected}
      connectWallet={openModal}
    />
  );
};

export default MyDelegationContainer;
