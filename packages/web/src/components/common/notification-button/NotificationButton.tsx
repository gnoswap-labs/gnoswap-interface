import { TransactionModel } from "@models/account/account-history-model";
import IconAlert from "@components/common/icons/IconAlert";
import NotificationList from "@components/common/notification-list/NotificationList";
import { AlertButton, NotificationWrapper } from "./NotificationButton.styles";
import { useAtom } from "jotai";
import { CommonState } from "@states/index";
import { DEVICE_TYPE } from "@styles/media";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useMemo } from "react";
import { usePreventScroll } from "@hooks/common/use-prevent-scroll";
export interface TransactionGroupsType {
  title: string;
  txs: Array<TransactionModel>;
}

const NotificationButton = ({ breakpoint }: { breakpoint: DEVICE_TYPE }) => {
  const [toggle, setToggle] = useAtom(CommonState.headerToggle);
  const { notificationRepository } = useGnoswapContext();
  const { account } = useWallet();
  const [notificationHash, setNotificationHash] = useAtom(CommonState.notificationHash);
  const handleESC = () => {
    setToggle(prev => {
      if (prev.notification) {
        return { ...prev, notification: false };
      }
      return prev;
    });
  };
  useEscCloseModal(handleESC);
  usePreventScroll(toggle.notification);

  const { data: txsGroupsInformation, refetch, isFetched } = useQuery<
    TransactionGroupsType[],
    Error
  >({
    queryKey: ["groupedNotification", account?.address],
    queryFn: () =>
      notificationRepository.getGroupedNotification({
        address: account?.address,
      }),
    refetchInterval: 1000 * 10,
  });

  const txs = useMemo(() => {
    return (txsGroupsInformation ?? []).reduce((pre, next) => {
      const allTxs = next.txs.flatMap(x => x.txHash);
      return [...pre, ...allTxs];
    }, [] as string[]);
  }, [txsGroupsInformation]);
  const handleClearAll = async () => {
    try {
      notificationRepository.appendRemovedTx(txs);
      await notificationRepository.clearNotification({
        address: account?.address,
      });
      refetch();
    } catch (e) {
      console.log("handleClearAll ~ e:", e);
    }
  };

  const onListToggle = () => {
    setToggle(prev => ({
      ...prev,
      notification: !prev.notification,
    }));
  };

  const showIcon = txs.length > 0 && txs[0] !== notificationHash;
  return (
    <NotificationWrapper>
      <AlertButton onClick={() => {
        onListToggle();
        setNotificationHash(txs?.[0] || "");
      }}>
        <IconAlert className="notification-icon" />
        {showIcon && isFetched && txsGroupsInformation?.length !== 0 ? (
          <div className="point-unread" />
        ) : null}
      </AlertButton>
      {toggle.notification && (
        <NotificationList
          txsGroupsInformation={txsGroupsInformation ?? []}
          onListToggle={() => {
            onListToggle();
          }}
          breakpoint={breakpoint}
          onClearAll={handleClearAll}
        />
      )}
    </NotificationWrapper>
  );
};

export default NotificationButton;
