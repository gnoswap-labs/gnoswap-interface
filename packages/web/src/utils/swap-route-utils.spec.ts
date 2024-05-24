import { EstimatedRoute } from "@models/swap/swap-route-info";
import { makeRoutesQuery } from "./swap-route-utils";

const estimatedRoutes: EstimatedRoute[] = [
  {
    routeKey:
      "gno.land/r/bar:gno.land/r/baz:500*POOL*gno.land/r/baz:gno.land/r/qux:500",
    pools: [
      {
        poolPath: "gno.land/r/bar:gno.land/r/baz:500",
        tokenA: "gno.land/r/bar",
        tokenB: "gno.land/r/baz",
        fee: 100,
        price: 1,
        tokenABalance: 0,
        tokenBBalance: 0,
      },
      {
        poolPath: "gno.land/r/baz:gno.land/r/qux:500",
        tokenA: "gno.land/r/baz",
        tokenB: "gno.land/r/qux",
        fee: 100,
        price: 1,
        tokenABalance: 0,
        tokenBBalance: 0,
      },
    ],
    quote: 95,
    amountIn: 9500n,
    amountOut: 36480n,
  },
  {
    routeKey:
      "gno.land/r/bar:gno.land/r/foo:500*POOL*gno.land/r/foo:gno.land/r/qux:500",
    pools: [
      {
        poolPath: "gno.land/r/bar:gno.land/r/foo:500",
        tokenA: "gno.land/r/bar",
        tokenB: "gno.land/r/foo",
        fee: 100,
        price: 1,
        tokenABalance: 0,
        tokenBBalance: 0,
      },
      {
        poolPath: "gno.land/r/foo:gno.land/r/qux:500",
        tokenA: "gno.land/r/foo",
        tokenB: "gno.land/r/qux",
        fee: 100,
        price: 1,
        tokenABalance: 0,
        tokenBBalance: 0,
      },
    ],
    quote: 5,
    amountIn: 500n,
    amountOut: 3360n,
  },
];

describe("make swap route query", () => {
  test("2 routes and 2 pools", async () => {
    const routeKey = makeRoutesQuery(estimatedRoutes, "gno.land/r/bar");

    expect(routeKey).toBe(
      "gno.land/r/bar:gno.land/r/baz:100*POOL*gno.land/r/baz:gno.land/r/qux:100,gno.land/r/bar:gno.land/r/foo:100*POOL*gno.land/r/foo:gno.land/r/qux:100",
    );
  });
});
