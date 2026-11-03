import React from "react";

import Button, { ButtonHierarchy } from "@components/common/button/Button";
import { isOrderButtonActionable, OrderButtonState } from "@hooks/order/data/use-order-handler.utils";

import { OrderFooter } from "./OrderForm.styles";

interface OrderFormButtonProps {
  state: OrderButtonState;
  text: string;
  /** Shown in red under the button when the order is too small. */
  minTradingText?: string;
  onClick: () => void;
}

/** Wallet login, network switch and the final action are clickable; every other state is a disabled gray button. */
const OrderFormButton: React.FC<OrderFormButtonProps> = ({ state, text, minTradingText, onClick }) => {
  const actionable = isOrderButtonActionable(state);

  return (
    <OrderFooter>
      <Button
        text={text}
        style={{ fullWidth: true, hierarchy: actionable ? ButtonHierarchy.Primary : ButtonHierarchy.Gray }}
        className={actionable ? "button-order button-actionable" : "button-order"}
        onClick={actionable ? onClick : undefined}
        disabled={!actionable}
      />
      {state === "AMOUNT_TOO_LOW" && minTradingText && <span className="min-trading">{minTradingText}</span>}
    </OrderFooter>
  );
};

export default OrderFormButton;
