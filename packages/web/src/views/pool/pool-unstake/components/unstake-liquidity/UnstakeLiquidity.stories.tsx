import { ComponentMeta, ComponentStory } from "@storybook/react";

import UnstakeLiquidity from "./UnstakeLiquidity";

export default {
  title: "pool/pool-unstake/UnstakeLiquidity",
  component: UnstakeLiquidity,
} as ComponentMeta<typeof UnstakeLiquidity>;

const Template: ComponentStory<typeof UnstakeLiquidity> = args => {
  return (
    <UnstakeLiquidity {...args} />
  );
};

export const Default = Template.bind({});
Default.args = {};
