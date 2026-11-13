import { NetworkClient } from "@common/clients/network-client";

import { OrderRepositoryImpl } from "./order-repository-impl";

const EARLIER_DCA = "gno.land/r/gnoswap/test/order/dca";

const makeRepository = () => {
  const get = jest.fn().mockResolvedValue({ data: { data: { items: [], pageInfo: {} } } });
  const repository = new OrderRepositoryImpl({ get } as unknown as NetworkClient, null, null);
  return { repository, urls: () => get.mock.calls.map(([{ url }]) => url) };
};

describe("OrderRepositoryImpl realm-scoped reads", () => {
  it("asks for an order of an earlier realm by its package path", async () => {
    const { repository, urls } = makeRepository();

    await repository.getDcaOrder("7", EARLIER_DCA);
    await repository.getDcaExecutions({ orderId: "7", packagePath: EARLIER_DCA, page: 2 });
    await repository.getLimitOrder("3", "gno.land/r/gnoswap/test/order/limit");
    await repository.getLimitOrderFills({ orderId: "3", packagePath: "gno.land/r/gnoswap/test/order/limit", page: 1 });

    const encodedDca = encodeURIComponent(EARLIER_DCA);
    expect(urls()).toEqual([
      `orders/dca/7?packagePath=${encodedDca}`,
      `orders/dca/7/executions?page=2&size=10&packagePath=${encodedDca}`,
      `orders/limit/3?packagePath=${encodeURIComponent("gno.land/r/gnoswap/test/order/limit")}`,
      `orders/limit/3/fills?page=1&size=10&packagePath=${encodeURIComponent("gno.land/r/gnoswap/test/order/limit")}`,
    ]);
  });

  it("leaves the realm to the order-api default when the order has none", async () => {
    const { repository, urls } = makeRepository();

    await repository.getDcaOrder("7");
    await repository.getDcaExecutions({ orderId: "7", page: 1 });

    expect(urls()).toEqual(["orders/dca/7", "orders/dca/7/executions?page=1&size=10"]);
  });
});

describe("OrderRepositoryImpl DCA pair settings", () => {
  it("asks for the settings of one direction", async () => {
    const { repository, urls } = makeRepository();
    const gnot = "gno.land/r/gnoland/wugnot";
    const gns = "gno.land/r/gnoswap/gns";

    await repository.getDcaPair({ inputToken: gnot, outputToken: gns });

    expect(urls()).toEqual([
      `orders/dca/pair?inputToken=${encodeURIComponent(gnot)}&outputToken=${encodeURIComponent(gns)}`,
    ]);
  });
});

describe("OrderRepositoryImpl limit market prices", () => {
  it("rejects unsuccessful HTTP responses", async () => {
    const post = jest.fn().mockResolvedValue({ status: 503, message: "unavailable", data: {} });
    const repository = new OrderRepositoryImpl({ post } as unknown as NetworkClient, null, null);

    await expect(
      repository.getLimitMarketPrices({ pairs: [{ tokenIn: "token/a", tokenOut: "token/b" }] }),
    ).rejects.toThrow("unavailable");
  });
});
