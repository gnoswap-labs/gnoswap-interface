import { SwapRouterRepositoryMock } from "./swap-router-repository-mock";

const makeToken = (path: string) => ({
  path,
  symbol: path,
  name: path,
  priceId: "",
  chainId: "",
  createdAt: "",
  address: "",
  decimals: 4,
  logoURI: "",
});

const amount = {
  amount: 0,
  currency: "",
};

const makePool = (tokenAPath: string, tokenBPath: string, tier: string) => ({
  tokenA: makeToken(tokenAPath),
  tokenB: makeToken(tokenBPath),
  tvl: amount,
  tvlChange: 0,
  volume: amount,
  volumeChange: 0,
  totalVolume: amount,
  id: `${tokenAPath}_${tokenBPath}_${tier}`,
  name: `${tokenAPath}_${tokenBPath}_${tier}`,
  apr: 0,
  fee: "0.05%",
  feeVolume: 0,
  feeChange: 0,
  currentTick: 0,
  price: 0,
  tokenABalance: 0,
  tokenBBalance: 0,
  tickSpacing: 0,
  bins: [],
});

const swapRouterRepository = new SwapRouterRepositoryMock();

describe("find all route's pool paths", () => {
  test("routes length is 0", () => {
    const pools = [makePool("foo", "bar", "100")];
    const inputToken = makeToken("foo");
    const outputToken = makeToken("baz");
    const routes = swapRouterRepository.findAllRoutesBy(
      inputToken,
      outputToken,
      pools,
      3,
    );
    expect(routes.length).toBe(0);
  });

  test("routes length is 3", () => {
    const pools = [
      makePool("foo", "bar", "100"),
      makePool("baz", "bar", "100"),
      makePool("baz", "bar", "500"),
      makePool("baz", "foo", "500"),
    ];
    const inputToken = makeToken("foo");
    const outputToken = makeToken("baz");
    const routes = swapRouterRepository.findAllRoutesBy(
      inputToken,
      outputToken,
      pools,
      3,
    );
    expect(routes.length).toBe(3);
  });
});
