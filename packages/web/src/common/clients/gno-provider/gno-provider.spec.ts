import { GnoProvider } from "./gno-provider";

const providerWithGasPrice = (getGasPrice: jest.Mock) =>
  Object.assign(Object.create(GnoProvider.prototype), { getGasPrice }) as GnoProvider;

describe("GnoProvider.getUgnotPerGas", () => {
  it("divides the ugnot amount by the gas", async () => {
    const provider = providerWithGasPrice(jest.fn().mockResolvedValue({ amount: 1, denom: "ugnot", gas: 1000 }));
    await expect(provider.getUgnotPerGas()).resolves.toBe(0.001);
  });

  it.each([
    ["the node has no gas price", () => jest.fn().mockResolvedValue(null)],
    ["the price is in another denom", () => jest.fn().mockResolvedValue({ amount: 1, denom: "uatom", gas: 1000 })],
    ["the query fails", () => jest.fn().mockRejectedValue(new Error("invalid gas price response"))],
  ])("returns 0 when %s", async (_, getGasPrice) => {
    jest.spyOn(console, "warn").mockImplementation(() => undefined);
    await expect(providerWithGasPrice(getGasPrice()).getUgnotPerGas()).resolves.toBe(0);
  });
});
