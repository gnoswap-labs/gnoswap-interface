import { useAtom } from "jotai";
import { useMemo } from "react";

import IconAlert from "@components/common/icons/IconAlert";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { usePreventScroll } from "@hooks/common/use-prevent-scroll";
import { useWallet } from "@hooks/wallet/use-wallet";
import { useGetNotifications } from "@query/common";
import { CommonState } from "@states/index";
import { DEVICE_TYPE } from "@styles/media";

import NotificationList from "./notification-list/NotificationList";

import { AlertButton, NotificationWrapper } from "./NotificationButton.styles";

const NotificationButton = ({ breakpoint }: { breakpoint: DEVICE_TYPE }) => {
  const [toggle, setToggle] = useAtom(CommonState.headerToggle);
  const { notificationRepository } = useGnoswapContext();
  const { account } = useWallet();
  const [notificationHash, setNotificationHash] = useAtom(
    CommonState.notificationHash,
  );
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

  const txs = useMemo(() => {
    return (transactionGroups ?? []).reduce((pre, next) => {
      const allTxs = next.txs.flatMap(x => x.txHash);
      return [...pre, ...allTxs];
    }, [] as string[]);
  }, [transactionGroups]);

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
      <AlertButton
        onClick={() => {
          onListToggle();
          setNotificationHash(txs?.[0] || "");
        }}
      >
        <IconAlert className="notification-icon" />
        {showIcon && isFetched && transactionGroups?.length !== 0 ? (
          <div className="point-unread" />
        ) : null}
      </AlertButton>
      {toggle.notification && (
        <NotificationList
          txsGroupsInformation={transactionGroups ?? []}
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
