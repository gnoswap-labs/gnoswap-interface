import { ComponentMeta, ComponentStory } from "@storybook/react";

import SelectLiquidity from "./SelectLiquidity";

export default {
  title: "pool/pool-unstake/SelectLiquidity",
  component: SelectLiquidity,
} as ComponentMeta<typeof SelectLiquidity>;

const Template: ComponentStory<typeof SelectLiquidity> = args => {
  return (
    <SelectLiquidity
      {...args}
    />
  );
};

export const Default = Template.bind({});
Default.args = {};
