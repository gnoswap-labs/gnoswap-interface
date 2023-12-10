import TokenTradingModal from "@components/common/token-trading-modal/TokenTradingModal";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { TokenModel } from "@models/token/token-model";
import React, { useCallback, useState } from "react";

interface Props {
  onClickConfirm: () => void;
  token: {[key in string]: string} | TokenModel;
}

const TokenTradingModalContainer:React.FC<Props> = ({ onClickConfirm, token }) => {
  const clearModal = useClearModal();
  const [checked, setChecked] = useState(false);

  const handleChecked = async () => {
    try {
      const url = `https://gnoscan.io/tokens/${token?.path}`;
      await navigator.clipboard.writeText(url);
      if (!checked) {
        setChecked(true);
        setTimeout(() => {
          setChecked(false);
        }, 2000);
      }
    } catch (e) {
      throw new Error("Copy Error!");
    }
  };

  const close = useCallback(() => {
    clearModal();
  }, [clearModal]);

  return <TokenTradingModal
    close={close}
    onClickConfirm={onClickConfirm}
    handleChecked={handleChecked}
    checked={checked}
    token={token}
  />;
};

export default TokenTradingModalContainer;
