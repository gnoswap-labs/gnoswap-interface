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

export interface TransactionGroupsType {
  title: string;
  txs: Array<TransactionModel>;
}

const NotificationButton = ({ breakpoint }: { breakpoint: DEVICE_TYPE }) => {
  const [toggle, setToggle] = useAtom(CommonState.headerToggle);
  const { notificationRepository } = useGnoswapContext();
  const { account } = useWallet();
  const handleESC = () => {
    setToggle(prev => {
      if (prev.notification) {
        return { ...prev, notification: false };
      }
      return prev;
    });
  };
  useEscCloseModal(handleESC);

  const { data: txsGroupsInformation, refetch, isFetched } = useQuery<
    TransactionGroupsType[],
    Error
  >({
    queryKey: ["groupedNotification", account?.address],
    queryFn: () =>
      notificationRepository.getGroupedNotification({
        address: account?.address,
      }),
    refetchInterval: 1000 * 5,
  });

  const handleClearAll = () => {
    const txs = (txsGroupsInformation ?? []).reduce((pre, next) => {
      const allTxs = next.txs.flatMap(x => x.txHash);
      return [...pre, ...allTxs];
    }, [] as string[]);
    notificationRepository.appendRemovedTx(txs);
    refetch();
  };

  const onListToggle = () => {
    setToggle(prev => ({
      ...prev,
      notification: !prev.notification,
    }));
  };

  return (
    <NotificationWrapper>
      <AlertButton onClick={onListToggle}>
        <IconAlert className="notification-icon" />
        {isFetched && txsGroupsInformation?.length !== 0 ? (
          <div className="point-unread" />
        ) : null}
      </AlertButton>
      {toggle.notification && (
        <NotificationList
          txsGroupsInformation={txsGroupsInformation ?? []}
          onListToggle={onListToggle}
          breakpoint={breakpoint}
          onClearAll={handleClearAll}
        />
      )}
    </NotificationWrapper>
  );
};

export default NotificationButton;
