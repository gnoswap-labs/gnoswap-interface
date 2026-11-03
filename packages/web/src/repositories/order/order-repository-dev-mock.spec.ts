import { OrderRepositoryDevMock } from "./order-repository-dev-mock";

describe("OrderRepositoryDevMock", () => {
  const sendTransaction = jest.fn();
  const walletClient = { getAddress: jest.fn().mockResolvedValue("g1owner"), sendTransaction };

  const createRepository = () =>
    new OrderRepositoryDevMock(
      null,
      walletClient as unknown as ConstructorParameters<typeof OrderRepositoryDevMock>[1],
      null,
    );

  beforeEach(() => sendTransaction.mockReset());

  it("reports that order mutations are disabled", () => {
    expect(createRepository().canMutateOrders).toBe(false);
  });

  it("never sends CancelOrder for a fixture DCA order", async () => {
    await expect(createRepository().sendCancelDcaOrder({ orderId: "12" })).rejects.toThrow("fixture");
    expect(sendTransaction).not.toHaveBeenCalled();
  });

  it("never sends Claim for a fixture DCA order", async () => {
    await expect(createRepository().sendClaimDcaOrder({ orderId: "12" })).rejects.toThrow("fixture");
    expect(sendTransaction).not.toHaveBeenCalled();
  });

  it("never sends CancelOrder for a fixture limit order", async () => {
    await expect(createRepository().sendCancelLimitOrder({ orderId: "9" })).rejects.toThrow("fixture");
    expect(sendTransaction).not.toHaveBeenCalled();
  });
});
