import type { Meta, StoryObj } from "@storybook/nextjs";
import { useCallback, useState } from "react";

import SelectLiquidityList from "./SelectLiquidityList";

const meta = {
  title: "stake/SelectLiquidityList",
  component: SelectLiquidityList,
  tags: ["autodocs"],
} satisfies Meta<typeof SelectLiquidityList>;

export default meta;
type Story = StoryObj<typeof SelectLiquidityList>;

export const Default: Story = {
  render: (args: React.ComponentProps<typeof SelectLiquidityList>) => {
    const [checkedList, setCheckedList] = useState<number[]>([]);
    const [checkedAll] = useState(false);

    const onCheckedItem = useCallback(
      (isChecked: boolean, id: number) => {
        if (isChecked) {
          return setCheckedList((prev: number[]) => [...prev, id]);
        }
        if (!isChecked && checkedList.includes(id)) {
          return setCheckedList(checkedList.filter(el => el !== id));
        }
      },
      [checkedList],
    );

    return (
      <SelectLiquidityList {...args} checkedList={checkedList} onCheckedItem={onCheckedItem} checkedAll={checkedAll} />
    );
  },
};
