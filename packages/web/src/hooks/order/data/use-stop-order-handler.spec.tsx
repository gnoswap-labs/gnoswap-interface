import { ThemeProvider } from "@emotion/react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Provider, useAtomValue } from "jotai";
import React from "react";

import { DcaOrderModel } from "@models/order/dca-order-model";
import { LimitOrderModel } from "@models/order/limit-order-model";
import { TokenModel } from "@models/token/token-model";
import { CommonState } from "@states/index";
import { getTheme } from "@utils/theme-utils";

import { useStopOrderHandler } from "./use-stop-order-handler";

const mockTranslate = (key: string) => key;
const mockOrderRepository = {};
const mockSubmit = jest.fn();
let mockTokenPrices: Record<string, { usd: string | undefined }>;
jest.mock("react-i18next", () => ({ useTranslation: () => ({ t: mockTranslate }) }));
jest.mock("@hooks/common/use-gnoswap-context", () => ({
  useGnoswapContext: () => ({ orderRepository: mockOrderRepository }),
}));
jest.mock("@query/order", () => ({ useGetDcaOrder: () => ({ data: undefined, isFetching: false }) }));
jest.mock("./use-order-transaction", () => ({ useOrderTransaction: () => ({ submit: mockSubmit }) }));
jest.mock("@hooks/token/data/use-token-data", () => ({
  useTokenData: () => ({ tokenPrices: mockTokenPrices }),
}));

const token: TokenModel = {
  type: "GRC20",
  chainId: "",
  createdAt: "",
  name: "Token",
  path: "gno.land/r/demo/token",
  decimals: 6,
  symbol: "TOKEN",
  displaySymbol: "TOKEN",
  logoURI: "",
  priceID: "gno.land/r/demo/token",
};
const limitOrder: LimitOrderModel = {
  orderId: "1",
  packagePath: "gno.land/r/demo/limit",
  isCurrentRealm: true,
  status: "OPEN",
  isActive: true,
  tokenIn: token,
  tokenOut: token,
  makingAmount: "2",
  takingAmount: "2.2",
  slippageBps: 50,
  minimumReceived: "2.189",
  minimumRemainingReceived: "2.189",
  executionFeeRate: 15,
  filledInput: "0",
  remainingInput: "2",
  refundedInput: "0",
  userOutput: "0",
  canCancel: true,
  limitPrice: "1.1",
  priceRate: null,
  progress: 0,
  createdAt: 1,
  expiresAt: 3601,
  closedAt: null,
  createdTxHash: "",
  closedTxHash: null,
};
const dcaOrder: DcaOrderModel = {
  orderId: "1",
  packagePath: "gno.land/r/demo/dca",
  isCurrentRealm: true,
  status: "ACTIVE",
  isActive: true,
  inputToken: token,
  outputToken: token,
  interval: 3600,
  executionCount: 2,
  executedCount: 0,
  remainingCount: 2,
  progress: 0,
  amountPerExecution: "1",
  depositAmount: "2",
  soldAmount: "0",
  purchasedAmount: "0",
  remainingAmount: "2",
  claimedAmount: "0",
  claimableAmount: "0",
  canClaim: false,
  priceRate: null,
  returnRate: null,
  nextExecutionAt: 3601,
  createdAt: 1,
  closedAt: null,
  createdTxHash: "",
  closedTxHash: null,
};

type Flow = "cancel" | "refund" | "stop";
const Preview = ({ flow }: { flow: Flow }) => {
  const { openCancelLimitOrder, openStopDcaOrder } = useStopOrderHandler();
  const content = useAtomValue(CommonState.modalContent);
  return (
    <>
      <button
        onClick={() =>
          flow === "stop"
            ? openStopDcaOrder(dcaOrder)
            : openCancelLimitOrder({ ...limitOrder, status: flow === "refund" ? "EXPIRED" : "OPEN" })
        }
      >
        Preview
      </button>
      {content}
    </>
  );
};

describe.each<Flow>(["cancel", "refund", "stop"])("%s confirmation USD amounts", flow => {
  it.each([
    ["", "-", "-"],
    [undefined, "-", "-"],
    ["invalid", "-", "-"],
    ["Infinity", "-", "-"],
    ["0", "$0", "$0"],
    ["0.383", "$0.766", "$0"],
  ])("handles USD price %s", (usd, remaining, sold) => {
    mockTokenPrices = { [token.path]: { usd } };
    render(
      <Provider>
        <ThemeProvider theme={getTheme("dark")}>
          <Preview flow={flow} />
        </ThemeProvider>
      </Provider>,
    );
    fireEvent.click(screen.getByText("Preview"));
    expect(
      screen.getByText("Swap:order.remainingAmount").closest(".info-row")?.querySelector(".sub-value"),
    ).toHaveTextContent(remaining);
    expect(
      screen.getByText("Swap:order.soldAmount").closest(".info-row")?.querySelector(".sub-value"),
    ).toHaveTextContent(sold);
  });
});
