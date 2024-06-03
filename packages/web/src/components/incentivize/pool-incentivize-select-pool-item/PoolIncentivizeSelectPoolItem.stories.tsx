import PoolIncentivizeSelectPoolItem, { type PoolIncentivizeSelectPoolItemProps } from "./PoolIncentivizeSelectPoolItem";
import { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { PoolRepositoryMock } from "@repositories/pool";
import { PoolMapper } from "@models/pool/mapper/pool-mapper";

const poolRepository = new PoolRepositoryMock();
const pools = (await poolRepository.getPools());

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

const poolSelectItem = PoolMapper.toPoolSelectItemInfo(pools[0]);

export const Default: StoryObj<PoolIncentivizeSelectPoolItemProps> = {
  args: {
    poolSelectItem,
    visibleLiquidity: false
  },
};