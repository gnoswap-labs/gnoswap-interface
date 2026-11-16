import { render, screen } from "@testing-library/react";

import { GNOT_TOKEN, GNS_TOKEN } from "@common/values/token-constant";
import { DcaOrderModel } from "@models/order/dca-order-model";

import DcaOrderItemCardContainer from "./DcaOrderItemCardContainer";

const mockUseGetRoutes = jest.fn();
jest.mock("@query/router", () => ({ useGetRoutes: (...args: unknown[]) => mockUseGetRoutes(...args) }));
jest.mock("../../components/order-list/order-card/DcaOrderItemCard", () => ({
  __esModule: true,
  default: ({ marketPrice }: { marketPrice: string | null }) => (
    <div data-testid="market-price">{String(marketPrice)}</div>
  ),
}));

const ORDER = {
  inputToken: { ...GNOT_TOKEN, decimals: 6 },
  outputToken: { ...GNS_TOKEN, decimals: 6 },
  amountPerExecution: "10",
  marketPrice: null,
} as unknown as DcaOrderModel;

const renderContainer = (order: DcaOrderModel) =>
  render(
    <DcaOrderItemCardContainer
      order={order}
      txUrl=""
      onClickStop={jest.fn()}
      onClickClaim={jest.fn()}
      renderHistory={() => null}
    />,
  );

beforeEach(() => {
  mockUseGetRoutes.mockReset();
  mockUseGetRoutes.mockReturnValue({ data: { status: "SUCCESS", amount: "8853200" } });
});

it("shows the order-api pool price without quoting the router", () => {
  renderContainer({ ...ORDER, marketPrice: "0.0885" });

  expect(screen.getByTestId("market-price")).toHaveTextContent("0.0885");
  expect(mockUseGetRoutes.mock.calls[0][1]).toMatchObject({ enabled: false });
});

it("falls back to a router quote of one round for an order-api without the pool price", () => {
  renderContainer(ORDER);

  expect(mockUseGetRoutes.mock.calls[0][0]).toMatchObject({ tokenAmount: "10", exactType: "EXACT_IN" });
  expect(mockUseGetRoutes.mock.calls[0][1]).toMatchObject({ enabled: true });
  expect(screen.getByTestId("market-price")).toHaveTextContent("0.88532");
});

it("shows no price while the fallback quote is unavailable", () => {
  mockUseGetRoutes.mockReturnValue({ data: { status: "NO_LIQUIDITY", amount: "0" } });
  renderContainer(ORDER);

  expect(screen.getByTestId("market-price")).toHaveTextContent("null");
});
