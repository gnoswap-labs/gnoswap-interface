import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "@storybook/test";

import SelectLiquidityItem from "./SelectLiquidityItem";

const meta = {
  title: "pool/pool-unstake/SelectLiquidityItem",
  component: SelectLiquidityItem,
  tags: ["autodocs"],
  parameters: {
    backgrounds: { default: "light" },
  },
} satisfies Meta<typeof SelectLiquidityItem>;

export default meta;
type Story = StoryObj<typeof SelectLiquidityItem>;

export const Default: Story = {
  args: {
    checkedList: [],
    onCheckedItem: fn(),
  },
  // render: (args: React.ComponentType<typeof SelectLiquidityItem>) => {
  //   const [checked, setChecked] = useState(false);
  //   return (
  //     <SelectLiquidityItem
  //       {...args}
  //       onCheckedItem={() => setChecked(prev => !prev)}
  //       checkedList={checked ? [1111] : []}
  //     />
  //   );
  // },
};
