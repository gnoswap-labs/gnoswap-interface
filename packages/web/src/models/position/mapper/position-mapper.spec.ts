import { PositionResponse } from "@repositories/position/response";
import { PositionMapper } from "./position-mapper";

const position: PositionResponse = {
  lpTokenId: "1",
  poolPath: "pool",
  staked: false,
  owner: "g1owner",
  tickLower: "0",
  tickUpper: "1",
  liquidity: "100",
  tokenABalance: "1",
  tokenBBalance: "2",
  usdValue: "3",
  unclaimedFeeAAmount: "0",
  unclaimedFeeBAmount: "0",
  closed: false,
  totalClaimedUsd: "0",
  unclaimedFeeAUsd: "0",
  unclaimedFeeBUsd: "0",
  tokenUri: "",
};

describe("PositionMapper", () => {
  it("defaults missing totalDailyRewardsUsd", () => {
    expect(PositionMapper.from(position).totalDailyRewardsUsd).toBe("$0");
  });
});
