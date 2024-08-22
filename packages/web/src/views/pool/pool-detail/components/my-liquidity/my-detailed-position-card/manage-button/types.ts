import { ValuesType } from "utility-types";

export const POSITION_ACTION = {
  DECREASE: "Pool:position.card.btn.manage.decrease",
  INCREASE: "Pool:position.card.btn.manage.increase",
  REPOSITION: "Pool:position.card.btn.manage.reposition",
  REMOVE: "Pool:position.btn.removePosition",
  STAKE: "Pool:staking.btn.stake",
  UNSTAKE: "Pool:staking.btn.unstake",
} as const;
export type POSITION_ACTION = ValuesType<typeof POSITION_ACTION>;
