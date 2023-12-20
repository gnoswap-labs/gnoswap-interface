import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useNotice } from "@hooks/common/use-notice";
import {
  TransferGRC20TokenRequest,
  TransferNativeTokenRequest,
} from "@repositories/wallet/request";
import { makeRandomId, parseJson } from "@utils/common";
import { useState } from "react";
import { TNoticeType } from "@context/NoticeContext";
import BigNumber from "bignumber.js";

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

    const descriptionFail = `Failed to Send ${BigNumber(
      request?.tokenAmount,
    ).div(1000000)} ${request?.token?.symbol}`;
    const descriptionSuccess = `Sent ${BigNumber(request?.tokenAmount).div(
      1000000,
    )} ${request?.token?.symbol}`;

    const callAction =
      type === "native"
        ? walletRepository.transferGNOTToken(request)
        : walletRepository.transferGRC20Token(request);

    callAction
      .then(response => {
        setNotice(null, {
          timeout: 50000,
          type: "pending",
          closeable: true,
          id: makeRandomId(),
        });
        setResult({
          hash: response.hash,
          success: true,
        });
        setTimeout(() => {
          setNotice(null, {
            timeout: 50000,
            type: "withdraw-success" as TNoticeType,
            closeable: true,
            id: makeRandomId(),
            data: {
              description: descriptionSuccess,
            },
          });
        }, 1000);
      })
      .catch((error: Error) => {
        const { code } = parseJson(error?.message);
        const isSuccess = code === 0;
        setResult({
          success: isSuccess,
          code,
        });
        if (code !== 4000) {
          setNotice(null, {
            timeout: 50000,
            type: "pending",
            closeable: true,
            id: makeRandomId(),
          });
          setTimeout(() => {
            setNotice(null, {
              timeout: 50000,
              type: isSuccess
                ? ("withdraw-success" as TNoticeType)
                : ("withdraw-error" as TNoticeType),
              closeable: true,
              id: makeRandomId(),
              data: {
                description: isSuccess ? descriptionSuccess : descriptionFail,
              },
            });
          }, 1000);
        }
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
