import { GnoJSONRPCProvider } from "@gnolang/gno-js-client";
import { AlphaRouter } from "./alpha-router";
import { DEFAULT_ROUTING_CONFIG_BY_CHAIN } from "./config";
import { ChainId, CurrencyAmount, TradeType } from "./core";
import {
  OnChainGasPriceProvider,
  OnChainQuoteProvider,
  TokenProvider,
  V3PoolProvider,
} from "./providers";
import { PortionProvider } from "./providers/portion-provider";
import { BAR_DEV, BAZ_DEV, WGNOT_DEV } from "./test-utils/mock-token";
import { GNO_PROVIDER_RPC } from "./utility";

jest.setTimeout(30000);

const ROUTING_CONFIG = DEFAULT_ROUTING_CONFIG_BY_CHAIN(ChainId.DEV_GNOSWAP);

test("real fetch call", async () => {
  const poolProvider = new V3PoolProvider(ChainId.DEV_GNOSWAP);
  const pools = await poolProvider.getPools();
  expect(pools.getAllPools()).toHaveLength(16);
});

describe("alpha router", () => {
  const chainId = ChainId.DEV_GNOSWAP;
  let provider: GnoJSONRPCProvider;
  let onChainQuoteProvider: OnChainQuoteProvider;
  let gasPriceProvider: OnChainGasPriceProvider;
  let portionProvider: PortionProvider;
  let poolProvider: V3PoolProvider;
  let alphaRouter: AlphaRouter;

  beforeEach(() => {
    provider = new GnoJSONRPCProvider(GNO_PROVIDER_RPC[chainId]);
    onChainQuoteProvider = new OnChainQuoteProvider(chainId, provider);
    gasPriceProvider = new OnChainGasPriceProvider();
    portionProvider = new PortionProvider();
    poolProvider = new V3PoolProvider(ChainId.DEV_GNOSWAP);
  });

  test("swap bar to wgnot, EXACT_IN 100_000_000", async () => {
    alphaRouter = new AlphaRouter({
      chainId,
      provider,
      onChainQuoteProvider,
      gasPriceProvider,
      portionProvider,
      v3PoolProvider: poolProvider,
    });
    const swap = await alphaRouter.route(
      CurrencyAmount.fromRawAmount(BAR_DEV, 100_000_000),
      WGNOT_DEV,
      TradeType.EXACT_INPUT,
      undefined,
      { ...ROUTING_CONFIG },
    );
    expect(swap).not.toBeNull();
  });

  test("swap bar to wgnot, EXACT_OUT 100_000_000", async () => {
    alphaRouter = new AlphaRouter({
      chainId,
      provider,
      onChainQuoteProvider,
      gasPriceProvider,
      portionProvider,
      v3PoolProvider: poolProvider,
    });
    const swap = await alphaRouter.route(
      CurrencyAmount.fromRawAmount(BAR_DEV, 100_000_000),
      WGNOT_DEV,
      TradeType.EXACT_OUTPUT,
      undefined,
      { ...ROUTING_CONFIG },
    );
    expect(swap).not.toBeNull();
  });

  test("swap bar to wgnot, EXACT_IN 100_000_000", async () => {
    alphaRouter = new AlphaRouter({
      chainId,
      provider,
      onChainQuoteProvider,
      gasPriceProvider,
      portionProvider,
      v3PoolProvider: poolProvider,
    });
    const swap = await alphaRouter.route(
      CurrencyAmount.fromRawAmount(BAR_DEV, 100_000_000),
      WGNOT_DEV,
      TradeType.EXACT_INPUT,
      undefined,
      { ...ROUTING_CONFIG },
    );
    expect(swap).not.toBeNull();
  });

  test("swap bar to wgnot, EXACT_OUT 100_000_000", async () => {
    const provider = new GnoJSONRPCProvider(GNO_PROVIDER_RPC[chainId]);
    const onChainQuoteProvider = new OnChainQuoteProvider(chainId, provider);
    const gasPriceProvider = new OnChainGasPriceProvider();
    const portionProvider = new PortionProvider();
    const poolProvider = new V3PoolProvider(ChainId.DEV_GNOSWAP);

    alphaRouter = new AlphaRouter({
      chainId,
      provider,
      onChainQuoteProvider,
      gasPriceProvider,
      portionProvider,
      v3PoolProvider: poolProvider,
    });
    const swap = await alphaRouter.route(
      CurrencyAmount.fromRawAmount(BAR_DEV, 100_000_000),
      WGNOT_DEV,
      TradeType.EXACT_OUTPUT,
      undefined,
      { ...ROUTING_CONFIG },
    );
    expect(swap).not.toBeNull();
  });

  test("swap bar to baz, EXACT_IN 100_000_000", async () => {
    alphaRouter = new AlphaRouter({
      chainId,
      provider,
      onChainQuoteProvider,
      gasPriceProvider,
      portionProvider,
      v3PoolProvider: poolProvider,
    });
    const swap = await alphaRouter.route(
      CurrencyAmount.fromRawAmount(BAR_DEV, 100_000_000),
      BAZ_DEV,
      TradeType.EXACT_INPUT,
      undefined,
      { ...ROUTING_CONFIG },
    );
    expect(swap).not.toBeNull();
  });

  test("swap bar to baz, EXACT_OUT 100_000_000", async () => {
    const provider = new GnoJSONRPCProvider(GNO_PROVIDER_RPC[chainId]);
    const onChainQuoteProvider = new OnChainQuoteProvider(chainId, provider);
    const gasPriceProvider = new OnChainGasPriceProvider();
    const portionProvider = new PortionProvider();
    const poolProvider = new V3PoolProvider(ChainId.DEV_GNOSWAP);

    alphaRouter = new AlphaRouter({
      chainId,
      provider,
      onChainQuoteProvider,
      gasPriceProvider,
      portionProvider,
      v3PoolProvider: poolProvider,
    });
    const swap = await alphaRouter.route(
      CurrencyAmount.fromRawAmount(BAR_DEV, 100_000_000),
      BAZ_DEV,
      TradeType.EXACT_OUTPUT,
      undefined,
      { ...ROUTING_CONFIG },
    );
    expect(swap).not.toBeNull();
  });
});
