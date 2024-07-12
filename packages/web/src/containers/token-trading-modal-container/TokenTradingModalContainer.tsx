import TokenTradingModal from "@components/common/token-trading-modal/TokenTradingModal";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";
import { TokenModel } from "@models/token/token-model";
import React, { useCallback, useState } from "react";

interface Props {
  onClickConfirm: () => void;
  onClose: () => void;
  token: { [key in string]: string } | TokenModel;
}

const TokenTradingModalContainer: React.FC<Props> = ({ onClickConfirm, token, onClose }) => {
  const clearModal = useClearModal();
  const { getTokenUrl } = useGnoscanUrl();
  const [checked, setChecked] = useState(false);
  const handleChecked = async () => {
    try {
      const url = getTokenUrl(token?.path);
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
    onClose();
    clearModal();
  }, [clearModal, onClose]);

  return <TokenTradingModal
    close={close}
    onClickConfirm={onClickConfirm}
    handleChecked={handleChecked}
    checked={checked}
    token={token}
  />;
};

export default TokenTradingModalContainer;
