import { render, screen } from "@testing-library/react";

import { GNOT_TOKEN, GNS_TOKEN } from "@common/values/token-constant";
import { DcaOrderModel } from "@models/order/dca-order-model";
import GnoswapThemeProvider from "@providers/gnoswap-theme-provider/GnoswapThemeProvider";

import DcaOrderItemCard from "./DcaOrderItemCard";

it("preserves each token's precision in the DCA deposit, sold and purchased amounts", () => {
  const order: DcaOrderModel = {
    orderId: "1",
    packagePath: "gno.land/r/demo/dca",
    isCurrentRealm: true,
    status: "CANCELLED",
    isActive: false,
    inputToken: { ...GNOT_TOKEN, decimals: 6 },
    outputToken: { ...GNS_TOKEN, decimals: 18 },
    interval: 3600,
    executionCount: 2,
    executedCount: 1,
    remainingCount: 1,
    progress: 50,
    amountPerExecution: "1.079988",
    depositAmount: "2.159976",
    soldAmount: "1.079988",
    purchasedAmount: "2.079988123456789012",
    remainingAmount: "1.079988",
    claimedAmount: "0",
    claimableAmount: "2.079988123456789012",
    canClaim: false,
    priceRate: null,
    returnRate: null,
    nextExecutionAt: null,
    createdAt: 1,
    closedAt: 3601,
    createdTxHash: "",
    closedTxHash: null,
  };

  render(
    <GnoswapThemeProvider>
      <DcaOrderItemCard
        order={order}
        roi={null}
        txUrl=""
        onClickStop={jest.fn()}
        onClickClaim={jest.fn()}
        renderHistory={() => null}
      />
    </GnoswapThemeProvider>,
  );

  expect(screen.getByText("2.159976 GNOT")).toBeInTheDocument();
  expect(screen.getByText("1.079988 GNOT")).toBeInTheDocument();
  expect(screen.getByText("2.079988123456789012 GNS")).toBeInTheDocument();
});
