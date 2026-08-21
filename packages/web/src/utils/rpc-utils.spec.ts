import {
  evaluateExpressionToNumber,
  evaluateExpressionToObject,
  evaluateExpressionToStrings,
  evaluateExpressionToUint256,
} from "./rpc-utils";

const DEV_RPC_NUMBER_RESPONSE = "(15 uint64)";
const DEV_RPC_OBJECT_RESPONSE =
  "(\"{\\\"pool\\\":false,\\\"position\\\":false,\\\"protocol_fee\\\":false,\\\"router\\\":false,\\\"staker\\\":false,\\\"launchpad\\\":false,\\\"governance\\\":false,\\\"gov_staker\\\":false,\\\"xgns\\\":false,\\\"community_pool\\\":false,\\\"emission\\\":false,\\\"withdraw\\\":false}\" string)";
const DEV_RPC_UINT256_RESPONSE = "(\"7912525539738091750091588668\" string)";

describe("evaluateExpressionToNumber", () => {
  it("parses the router.GetSwapFee dev RPC response", () => {
    expect(evaluateExpressionToNumber(DEV_RPC_NUMBER_RESPONSE)).toBe(15);
  });
});

describe("evaluateExpressionToObject", () => {
  it("parses the halt.GetHaltConfigJson dev RPC response", () => {
    expect(evaluateExpressionToObject<Record<string, boolean>>(DEV_RPC_OBJECT_RESPONSE)).toEqual({
      pool: false,
      position: false,
      protocol_fee: false,
      router: false,
      staker: false,
      launchpad: false,
      governance: false,
      gov_staker: false,
      xgns: false,
      community_pool: false,
      emission: false,
      withdraw: false,
    });
  });
});

describe("evaluateExpressionToUint256", () => {
  it("parses the pool.GetSlot0SqrtPriceX96 dev RPC response", () => {
    expect(evaluateExpressionToUint256(DEV_RPC_UINT256_RESPONSE)).toBe(7912525539738091750091588668n);
  });
});

describe("evaluateExpressionToStrings", () => {
  it("parses typed values and untyped nil values", () => {
    expect(evaluateExpressionToStrings("(123 string)\n(456 string)\n(undefined)")).toEqual(["123", "456", "undefined"]);
  });

  it("preserves spaces inside typed string values", () => {
    expect(evaluateExpressionToStrings("(\"hello world\" string)")).toEqual(["hello world"]);
  });
});
