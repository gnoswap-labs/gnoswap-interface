import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useNotice } from "@hooks/common/use-notice";
import {
  TransferGRC20TokenRequest,
  TransferNativeTokenRequest,
} from "@repositories/wallet/request";
import { makeRandomId } from "@utils/common";
import { useState } from "react";
import { TNoticeType } from "src/context/NoticeContext";

type Request = TransferGRC20TokenRequest | TransferNativeTokenRequest;
export type WithdrawResponse = {
  hash?: string;
  success: boolean;
  code?: number;
} | null;

const useWithdrawTokens = () => {
  const { walletRepository } = useGnoswapContext();

  const [loading, setLoading] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [result, setResult] = useState<WithdrawResponse>(null);

  const { setNotice } = useNotice();

  const onSubmit = async (request: Request, type: "native" | "grc20") => {
    setLoading(true);

    setNotice(null, {
      timeout: 50000,
      type: "pending",
      closeable: true,
      id: makeRandomId(),
    });

    const callAction =
      type === "native"
        ? walletRepository.transferGNOTToken(request)
        : walletRepository.transferGRC20Token(request);

    callAction
      .then(response => {
        setResult({
          hash: response.hash,
          success: true,
        });
        setNotice(null, {
          timeout: 50000,
          type: "success" as TNoticeType,
          closeable: true,
          id: makeRandomId(),
        });
      })
      .catch((error: Error) => {
        const { code } = JSON.parse(error?.message);
        setResult({
          success: false,
          code,
        });
        setNotice(null, {
          timeout: 50000,
          type: "error" as TNoticeType,
          closeable: true,
          id: makeRandomId(),
        });
      })
      .finally(() => setLoading(false));
  };

  return {
    onSubmit,
    setIsConfirm,
    isConfirm,
    result,
    loading,
    setResult,
  };
};

export default useWithdrawTokens;
