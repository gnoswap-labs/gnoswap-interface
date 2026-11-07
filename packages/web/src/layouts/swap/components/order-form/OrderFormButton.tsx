import React from "react";
import { useTranslation } from "react-i18next";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import { isOrderButtonActionable, OrderButtonState } from "@hooks/order/data/use-order-handler.utils";

import { OrderFooter } from "./OrderForm.styles";

interface OrderFormButtonProps {
  state: OrderButtonState;
  text: string;
  /** Shown in red under the button when the order is too small. */
  minTradingText?: string;
  onClick: () => void;
  /** Max on the sell field: the same estimate its own button runs. */
  onClickMax: () => void;
  /** True while Max is being worked out. No order is placed on an amount still to come. */
  loadingMaxAmount: boolean;
  /** False while Max waits on order terms that are not settled yet; it cannot be retried until then. */
  maxAmountReady?: boolean;
  /** True when Max could not be worked out for the form as it stands, and cleared the amount. */
  maxAmountFailed: boolean;
}

/**
 * Wallet login, network switch and the final action are clickable; every other state is a disabled gray button.
 * After a failed Max, the button retries Max where it would ask for an amount. The retry only fills the field:
 * the order is still placed with a press of its own.
 */
const OrderFormButton: React.FC<OrderFormButtonProps> = ({
  state,
  text,
  minTradingText,
  onClick,
  onClickMax,
  loadingMaxAmount,
  maxAmountReady = true,
  maxAmountFailed,
}) => {
  const { t } = useTranslation();
  // Wallet, network, a paused realm and a missing token all come before the amount.
  const retriesMax = maxAmountFailed && state === "ENTER_AMOUNT";
  // While Max is out, whatever the field held is about to be replaced, so nothing is placed on it.
  const waitsForMax = loadingMaxAmount && (retriesMax || state === "PLACE_ORDER");
  const actionable = !waitsForMax && (retriesMax ? maxAmountReady : isOrderButtonActionable(state));
  const action = retriesMax ? onClickMax : onClick;

  return (
    <OrderFooter>
      <Button
        text={retriesMax ? t("Swap:swapButton.retryMaxCalculation") : text}
        style={{ fullWidth: true, hierarchy: actionable ? ButtonHierarchy.Primary : ButtonHierarchy.Gray }}
        className={actionable ? "button-order button-actionable" : "button-order"}
        onClick={actionable ? action : undefined}
        disabled={!actionable}
      />
      {state === "AMOUNT_TOO_LOW" && minTradingText && <span className="min-trading">{minTradingText}</span>}
    </OrderFooter>
  );
};

export default OrderFormButton;
