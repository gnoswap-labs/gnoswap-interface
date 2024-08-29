import React from "react";

import { useWallet } from "@hooks/wallet/use-wallet";
import { nullMyDelegationInfo } from "@repositories/governance";
import { useGetMyDelegation } from "@query/governance";

import MyDelegation from "../../components/my-delegation/MyDelegation";

const MyDelegationContainer: React.FC = () => {
  const { account } = useWallet();

  const { data: myDelegationInfo, isFetching } = useGetMyDelegation({
    address: account?.address || "",
  });

  return (
    <MyDelegation
      myDelegationInfo={myDelegationInfo ?? nullMyDelegationInfo}
      isLoading={isFetching && !myDelegationInfo}
    />
  );
};

export default MyDelegationContainer;
