import { useCallback, useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";

import SelectLiquidity from "./SelectLiquidity";

const meta = {
  title: "stake/SelectLiquidity",
  component: SelectLiquidity,
  tags: ["autodocs"],
} satisfies Meta<typeof SelectLiquidity>;

export default meta;
type Story = StoryObj<typeof SelectLiquidity>;

export const Default: Story = {
  render: (args: React.ComponentProps<typeof SelectLiquidity>) => {
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
      <SelectLiquidity {...args} checkedList={checkedList} onCheckedItem={onCheckedItem} checkedAll={checkedAll} />
    );
  },
};
