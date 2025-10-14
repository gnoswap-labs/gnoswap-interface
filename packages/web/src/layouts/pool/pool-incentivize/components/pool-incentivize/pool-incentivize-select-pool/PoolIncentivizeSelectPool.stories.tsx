import type { Meta, StoryObj } from "@storybook/nextjs";
import { useCallback, useState } from "react";

import { PoolSelectItemInfo } from "@models/pool/info/pool-select-item-info";
import { PoolMapper } from "@models/pool/mapper/pool-mapper";
import { PoolRepositoryMock } from "@repositories/pool";

import PoolIncentivizeSelectPool from "./PoolIncentivizeSelectPool";

const poolRepository = new PoolRepositoryMock();
const pools = (await poolRepository.getPools()).map(PoolMapper.toPoolSelectItemInfo);

const meta = {
  title: "incentivize/PoolIncentivizeSelectPool",
  component: PoolIncentivizeSelectPool,
  tags: ["autodocs"],
} satisfies Meta<typeof PoolIncentivizeSelectPool>;

export default meta;
type Story = StoryObj<typeof PoolIncentivizeSelectPool>;

export const Default: Story = {
  args: {
    pools,
  },
  render: (args: React.ComponentProps<typeof PoolIncentivizeSelectPool>) => {
    const [selectedPool, setSelectedPool] = useState<PoolSelectItemInfo | null>(null);

    const select = useCallback((poolId: string) => {
      const pool = pools.find(p => p.poolId === poolId);
      if (pool) {
        setSelectedPool(pool);
      }
    }, []);

    return <PoolIncentivizeSelectPool {...args} selectedPool={selectedPool} select={select} />;
  },
};
