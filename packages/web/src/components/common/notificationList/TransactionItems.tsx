import { TransactionModel } from "@/models/account/account-history-model";
import IconCircleInCancel from "../icons/IconCircleInCancel";
import IconCircleInCheck from "../icons/IconCircleInCheck";
import IconCircleInMore from "../icons/IconCircleInMore";
import { TransactionGroupsType } from "./NotificationList";
import {
  DoubleLogoWrapperTest,
  TxsDateAgoTitle,
  TxsListItem,
  TxsSummaryItem,
} from "./NotificationList.styles";

const TransactionItems = ({ groups }: { groups: TransactionGroupsType }) => {
  const { title, txs } = groups;
  return (
    <TxsListItem key={title}>
      <TxsDateAgoTitle>{title}</TxsDateAgoTitle>
      {txs.map((item: TransactionModel) => (
        <TxsSummaryItem>
          {/* TODO : Code cleanup coming after Double Logo Component PR is merged */}
          {item.txType === 1 ? (
            <DoubleLogoWrapperTest>
              <img src="https://picsum.photos/id/7/24/24" alt="logo-image" />
              <img
                src="https://picsum.photos/id/101/24/24"
                alt="logo-image"
                className="right-logo"
              />
            </DoubleLogoWrapperTest>
          ) : (
            <DoubleLogoWrapperTest>
              <img
                src="https://picsum.photos/id/101/24/24"
                alt="logo"
                className="summary-logo-test"
              />
            </DoubleLogoWrapperTest>
          )}
          {/* TODO : Need to write a template function to generate content to display based on transaction type. */}
          <span className="summary-content">{item.content}</span>
          {item.status === "SUCCESS" ? (
            <IconCircleInCheck className="success-icon status-icon" />
          ) : item.status === "FAILED" ? (
            <IconCircleInCancel className="failed-icon status-icon" />
          ) : (
            item.status === "PENDING" && (
              <IconCircleInMore className="pending-icon status-icon" />
            )
          )}
        </TxsSummaryItem>
      ))}
    </TxsListItem>
  );
};

export default TransactionItems;
