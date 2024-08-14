import TokenWarningModal from "@components/common/token-warning-modal/TokenWarningModal";
import { useClearModal } from "@hooks/common/use-clear-modal";
import { useGnoscanUrl } from "@hooks/common/use-gnoscan-url";
import { TokenModel } from "@models/token/token-model";
import React, { useCallback, useState } from "react";

interface TokenWarningModalContainerProps {
  onClickConfirm: () => void;
  onClose: () => void;
  token: { [key in string]: string } | TokenModel;
}

const TokenWarningModalContainer: React.FC<TokenWarningModalContainerProps> = ({ onClickConfirm, token, onClose }) => {
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
      throw new Error(`Copy Error! ${e}`);
    }
  };

  const close = useCallback(() => {
    onClose();
    clearModal();
  }, [clearModal, onClose]);

  return <TokenWarningModal
    close={close}
    onClickConfirm={onClickConfirm}
    handleChecked={handleChecked}
    checked={checked}
    token={token}
  />;
};

export default TokenWarningModalContainer;
