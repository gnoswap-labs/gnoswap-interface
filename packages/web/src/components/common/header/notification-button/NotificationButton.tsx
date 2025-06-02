import { useAtom } from "jotai";
import { useMemo } from "react";

import IconAlert from "@components/common/icons/IconAlert";
import useEscCloseModal from "@hooks/common/use-esc-close-modal";
import { useGnoswapContext } from "@hooks/common/use-gnoswap-context";
import { usePreventScroll } from "@hooks/common/use-prevent-scroll";
import { useWallet } from "@hooks/wallet/data/use-wallet";
import { useGetNotifications } from "@query/common";
import { CommonState } from "@states/index";
import { DEVICE_TYPE } from "@styles/media";
import { TransactionGroupsType } from "@models/notification";
import { TransactionModel } from "@models/account/account-history-model";
import { makeDisplayTokenAmount } from "@utils/token-utils";

import NotificationList from "./notification-list/NotificationList";

import { AlertButton, NotificationWrapper } from "./NotificationButton.styles";

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

  const { data: transactionGroups, refetch, isFetched } = useGetNotifications();

  const txGroups: TransactionGroupsType[] = useMemo(() => {
    if (!transactionGroups) return [];

    return [...transactionGroups].map((transactionGroup: TransactionGroupsType) => {
      return {
        ...transactionGroup,
        txs: transactionGroup.txs.map((tx: TransactionModel) => {
          return {
            ...tx,
            rawValue: {
              ...tx.rawValue,
              tokenAAmount: String(makeDisplayTokenAmount(tx.rawValue.tokenA, tx.rawValue.tokenAAmount) ?? 0),
              tokenBAmount: String(makeDisplayTokenAmount(tx.rawValue.tokenB, tx.rawValue.tokenBAmount) ?? 0),
            },
          };
        }),
      };
    });
  }, [transactionGroups]);

  const txs = useMemo(() => {
    return (txGroups ?? []).reduce((pre, next) => {
      const allTxs = next.txs.flatMap(x => x.txHash);
      return [...pre, ...allTxs];
    }, [] as string[]);
  }, [txGroups]);

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
