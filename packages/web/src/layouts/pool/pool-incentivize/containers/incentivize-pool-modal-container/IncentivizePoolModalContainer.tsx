import BigNumber from "bignumber.js";
import { useAtom } from "jotai";
import { useCallback } from "react";

import { ERROR_VALUE } from "@common/errors/adena";
import { useAddress } from "@hooks/common/use-address";
import { useBroadcastHandler } from "@hooks/common/use-broadcast-handler";
import { useClearModal } from "@hooks/common/use-clear-modal";
import useRouter from "@hooks/common/use-custom-router";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useMessage } from "@hooks/common/use-message";
import { usePositionData } from "@hooks/pool/data/use-position-data";
import { useTransactionConfirmModal } from "@hooks/common/use-transaction-confirm-modal";
import { useTransactionEventStore } from "@hooks/common/use-transaction-event-store";
import { useGetIncentivizePoolList, useGetPoolList, useRefetchGetPoolDetailByPath } from "@query/pools";
import { useGetPoolStakingListByAddress } from "@query/pools/use-get-pool-staking-list-by-address";
import { DexEvent } from "@repositories/common";
import { EarnState } from "@states/index";

import IncentivizePoolModal from "../../components/incentivize-pool-modal/IncentivizePoolModal";
import { useTokenData } from "@hooks/token/data/use-token-data";
import { BROADCAST_ERROR_VALUE } from "@common/errors/broadcast/broadcast-error";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { useNetworkFee } from "@hooks/common/use-network-fee";
import { CreateExternalIncentiveRequest } from "@repositories/pool/request/create-external-incentive-request";
import { GnoProvider } from "@common/clients/gno-provider/gno-provider";
import { CommonError } from "@common/errors";
import { fetchAllowance } from "@common/clients/wallet-client/transaction-messages";
import { makeCreateExternalIncentiveMessageWithApproves } from "@repositories/pool/pool.message";

const DAY_TIME = 24 * 60 * 60;
const MILLISECONDS = 1000;

interface IncentivizePoolModalContainerProps {
  poolPath?: string;
}

const IncentivizePoolModalContainer: React.FC<IncentivizePoolModalContainerProps> = ({ poolPath }) => {
  const { broadcastSuccess, broadcastError, broadcastRejected, broadcastLoading } = useBroadcastHandler();
  const { enqueueEvent } = useTransactionEventStore();
  const router = useRouter();
  const clearModal = useClearModal();
  const { poolRepository, transactionService } = useGnoswapContext();
  const [period] = useAtom(EarnState.period);
  const [startDate] = useAtom(EarnState.date);
  const [dataModal] = useAtom(EarnState.dataModal);
  const [pool] = useAtom(EarnState.pool);

  const { walletClient } = useWallet();
  const { address } = useAddress();
  const { estimateNetworkFee } = useNetworkFee(null);

  // refetch functions
  const { updateBalances } = useTokenData();
  const { refetch: refetchPositions } = usePositionData({ address, scopeId: "IncentivizePoolModalContainer" });

  const { refetch: refetchPools } = useGetPoolList();
  const { refetch: refetchIncentivizePools } = useGetIncentivizePoolList();
  const { refetch: refetchPoolDetails } = useRefetchGetPoolDetailByPath(poolPath);
  const { refetch: refetchStakingList } = useGetPoolStakingListByAddress(address || "");

  const { getMessage } = useMessage();

  const onCloseConfirmTransactionModal = useCallback(() => {
    clearModal();

    const pathName = router.pathname;
    if (pathName === "/earn/incentivize") {
      router.push("/earn");
    } else {
      router.push(router.asPath.replace("/incentivize", ""));
    }
  }, [clearModal, router]);

  const { openModal: openTransactionConfirmModal } = useTransactionConfirmModal({
    closeCallback: onCloseConfirmTransactionModal,
  });

  const buildAdenaWalletCreateIncentiveAction = async (request: CreateExternalIncentiveRequest) => {
    return poolRepository.createExternalIncentive(request);
  };

  const buildSocialWalletCreateIncentiveAction = async (
    rpcProvider: GnoProvider | null,
    request: CreateExternalIncentiveRequest,
    caller: string,
  ) => {
    if (!rpcProvider) {
      console.log("CreateExternalIncentive: ", new CommonError("FAILED_INITIALIZE_GNO_PROVIDER"));
      return null;
    }

    const getAllowance = (packagePath: string, owner: string, spender: string) => {
      return fetchAllowance(rpcProvider, packagePath, owner, spender);
    };

    const messageRequests: CreateExternalIncentiveRequest & { caller: string } = {
      ...request,
      caller,
    };
    const txMessages = await makeCreateExternalIncentiveMessageWithApproves(messageRequests, getAllowance);

    const txDoc = await transactionService.createDocument({ messages: txMessages });
    await transactionService.createTransaction(txDoc);

    const { currentGasInfo, networkFee } = await estimateNetworkFee(txDoc);
    const requestWithGasInfo: CreateExternalIncentiveRequest = {
      ...request,
      gasFee: networkFee?.amount,
      gasUsed: currentGasInfo?.gasUsed.toString(),
    };

    return poolRepository.createExternalIncentive(requestWithGasInfo);
  };

  const createExternalIncentive = useCallback(
    async ({ rpcProvider }: { rpcProvider: GnoProvider | null }) => {
      if (!pool || !dataModal?.token || !address) {
        return null;
      }
      const startUTCDate = Date.UTC(startDate.year, startDate.month - 1, startDate.date, 0, 0, 0, 0);
      // `startTime` is current UTC time to Unix timestamp
      const startTime = new Date(startUTCDate).getTime() / MILLISECONDS;
      // `endTime` adds the period time to the start unix time.
      const endTime = startTime + period * DAY_TIME;

      const displayAmount = BigNumber(dataModal.amount).toFormat();

      const walletType = walletClient?.getWalletType();

      const request: CreateExternalIncentiveRequest = {
        poolPath: pool.poolPath,
        rewardToken: dataModal.token,
        rewardAmount: dataModal.amount || "0",
        startTime,
        endTime,
      };

      if (walletType === "ADENA") {
        broadcastLoading(
          getMessage(DexEvent.ADD_INCENTIVE, "pending", {
            tokenAAmount: displayAmount,
            tokenASymbol: dataModal?.token?.symbol,
          }),
        );
      }

      const result =
        walletType === "ADENA"
          ? await buildAdenaWalletCreateIncentiveAction(request)
          : await buildSocialWalletCreateIncentiveAction(rpcProvider, request, address);

      if (result) {
        if (result.code === 0 || result.code === ERROR_VALUE.TRANSACTION_FAILED.status) {
          enqueueEvent({
            txHash: result.data?.hash,
            action: DexEvent.ADD_INCENTIVE,
            visibleEmitResult: true,
            formatData: () => ({
              tokenAAmount: displayAmount,
              tokenASymbol: dataModal?.token?.symbol,
            }),
            onEmit: async () => {
              refetchPools();
              refetchPositions();
              refetchIncentivizePools();
              refetchPoolDetails();
              refetchStakingList();
            },
            onUpdate: async () => {
              updateBalances();
            },
          });
        }
        if (result.code === 0) {
          openTransactionConfirmModal();
          broadcastSuccess(
            getMessage(
              DexEvent.ADD_INCENTIVE,
              "success",
              {
                tokenAAmount: displayAmount,
                tokenASymbol: dataModal?.token?.symbol,
              },
              result.data?.hash,
            ),
          );
        } else if (
          result.code === ERROR_VALUE.TRANSACTION_REJECTED.status /// 4000
        ) {
          broadcastRejected(
            getMessage(DexEvent.ADD_INCENTIVE, "error", {
              tokenAAmount: displayAmount,
              tokenASymbol: dataModal?.token?.symbol,
            }),
          );
          openTransactionConfirmModal();
        } else {
          broadcastError(BROADCAST_ERROR_VALUE.DEFAULT);
          openTransactionConfirmModal();
        }
      }
      return result;
    },
    [address, poolRepository, dataModal, period, pool, router, startDate.date, startDate.month, startDate.year],
  );

  return (
    <IncentivizePoolModal
      close={clearModal}
      onSubmit={createExternalIncentive}
      data={dataModal}
      date={startDate}
      period={period}
      pool={pool}
    />
  );
};

export default IncentivizePoolModalContainer;
