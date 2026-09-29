import { GnoProvider } from "./gno-provider";

const providerWithGasPrice = (getGasPrice: jest.Mock) =>
  Object.assign(Object.create(GnoProvider.prototype), { getGasPrice }) as GnoProvider;

describe("GnoProvider.getUgnotPerGas", () => {
  it("divides the ugnot amount by the gas", async () => {
    const provider = providerWithGasPrice(jest.fn().mockResolvedValue({ amount: 1, denom: "ugnot", gas: 1000 }));
    await expect(provider.getUgnotPerGas()).resolves.toBe(0.001);
  });

  it("returns 0 when the node has no price, uses another denom, or fails", async () => {
    for (const getGasPrice of [
      jest.fn().mockResolvedValue(null),
      jest.fn().mockResolvedValue({ amount: 1, denom: "uatom", gas: 1000 }),
      jest.fn().mockRejectedValue(new Error("rpc down")),
    ]) {
      await expect(providerWithGasPrice(getGasPrice).getUgnotPerGas()).resolves.toBe(0);
    }
  });
});
