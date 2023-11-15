import OneClickStakingModal from "@components/common/one-click-staking-modal/OneClickStakingModal";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { useWallet } from "@hooks/wallet/use-wallet";
import React, { useCallback } from "react";

const OneClickStakingModalContainer = () => {
  const clearModal = useClearModal();
  const { connectAdenaClient } = useWallet();

  const close = useCallback(() => {
    clearModal();
  }, [clearModal]);

  const connect = useCallback(() => {
    connectAdenaClient();
    close();
  }, [connectAdenaClient, close]);
  
  return <OneClickStakingModal close={close} connect={connect}/>;
};

export default OneClickStakingModalContainer;
