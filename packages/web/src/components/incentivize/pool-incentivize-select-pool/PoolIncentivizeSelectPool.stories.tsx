import PoolIncentivizeSelectPool from "./PoolIncentivizeSelectPool";
import { ComponentStory, Meta } from "@storybook/react";
import { useCallback, useState } from "react";
import { PoolRepositoryMock } from "@repositories/pool";
import { PoolSelectItemInfo } from "@models/pool/info/pool-select-item-info";
import { PoolMapper } from "@models/pool/mapper/pool-mapper";

const poolRepository = new PoolRepositoryMock();
const pools = (await poolRepository.getPools()).map(PoolMapper.toPoolSelectItemInfo);

export default {
  title: "incentivize/PoolIncentivizeSelectPool",
  component: PoolIncentivizeSelectPool,
} as Meta<typeof PoolIncentivizeSelectPool>;

const Template: ComponentStory<typeof PoolIncentivizeSelectPool> = args => {
  const [selectedPool, setSelectedPool] = useState<PoolSelectItemInfo | null>(null);

  const select = useCallback((poolId: string) => {
    const pool = pools.find(p => p.poolId === poolId);
    if (pool) {
      setSelectedPool(pool);
    }
  }, []);

  return (
    <PoolIncentivizeSelectPool
      {...args}
      selectedPool={selectedPool}
      select={select}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  pools
};