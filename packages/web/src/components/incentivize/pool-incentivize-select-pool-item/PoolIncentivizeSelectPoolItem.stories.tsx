import { toPoolSelectItemInfo } from "@models/pool/info/pool-select-item-info";
import PoolIncentivizeSelectPoolItem, { type PoolIncentivizeSelectPoolItemProps } from "./PoolIncentivizeSelectPoolItem";
import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { PoolRepositoryMock } from "@repositories/pool";

const poolRepository = new PoolRepositoryMock();
const pools = (await poolRepository.getPools()).pools;

const Template: React.FC<PoolIncentivizeSelectPoolItemProps> = (args) => {
  return (
    <div style={{ backgroundColor: "#141A29" }}>
      <PoolIncentivizeSelectPoolItem {...args} />
    </div>
  );
};

export default {
  title: "incentivize/PoolIncentivizeSelectPoolItem",
  component: Template,

} as Meta<typeof PoolIncentivizeSelectPoolItem>;

const poolSelectItem = toPoolSelectItemInfo(pools[0]);

export const Default: StoryObj<PoolIncentivizeSelectPoolItemProps> = {
  args: {
    poolSelectItem,
    visibleLiquidity: false
  },
};