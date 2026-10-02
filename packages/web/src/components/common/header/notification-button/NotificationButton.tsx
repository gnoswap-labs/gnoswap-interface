import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useMemo } from "react";

import IconAlert from "@components/common/icons/IconAlert";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { usePreventScroll } from "@hooks/common/use-prevent-scroll";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { useGetNotifications } from "@query/common";
import { QUERY_KEY } from "@query/query-keys";
import { CommonState } from "@states/index";
import { DEVICE_TYPE } from "@styles/media";
import { TransactionGroupsType } from "@models/notification";
import { NotificationConverter } from "@services/converters/notification";

import NotificationList from "./notification-list/NotificationList";

import { AlertButton, NotificationWrapper } from "./NotificationButton.styles";

const NotificationButton = ({ breakpoint }: { breakpoint: DEVICE_TYPE }) => {
  const [toggle, setToggle] = useAtom(CommonState.headerToggle);
  const { notificationRepository } = useGnoswapContext();
  const { account, currentChainId } = useWallet();
  const queryClient = useQueryClient();
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

  const { data: transactionGroups, refetch, isFetched } = useGetNotifications();

  const txGroups: TransactionGroupsType[] = useMemo(() => {
    return NotificationConverter.convertTransactionGroups(transactionGroups);
  }, [transactionGroups]);

  const txs = useMemo(() => {
    return (txGroups ?? []).reduce((pre, next) => {
      const allTxs = next.txs.flatMap(x => x.txHash);
      return [...pre, ...allTxs];
    }, [] as string[]);
  }, [txGroups]);

  const handleClearAll = () => {
    if (!account?.address) {
      return;
    }

    const queryKey = [QUERY_KEY.notifications, currentChainId, account?.address];
    const previousNotifications = queryClient.getQueryData(queryKey);
    queryClient.setQueryData(queryKey, []);
    notificationRepository
      .clearNotification({ address: account?.address })
      .then(() => refetch())
      .catch(e => {
        console.error("handleClearAll ~ clearNotification error:", e);
        queryClient.setQueryData(queryKey, previousNotifications);
      });
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
      <AlertButton
        onClick={() => {
          onListToggle();
          setNotificationHash(txs?.[0] || "");
        }}
      >
        <IconAlert className="notification-icon" />
        {showIcon && isFetched && txGroups?.length !== 0 ? <div className="point-unread" /> : null}
      </AlertButton>
      {toggle.notification && (
        <NotificationList
          txsGroupsInformation={txGroups ?? []}
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
