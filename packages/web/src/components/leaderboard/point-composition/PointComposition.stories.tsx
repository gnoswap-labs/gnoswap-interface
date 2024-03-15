import { ComponentStory, ComponentMeta } from "@storybook/react";
import PointComposition from "./PointComposition";

export default {
  title: "leaderboard/PointComposition",
  component: PointComposition,
} as ComponentMeta<typeof PointComposition>;

const Template: ComponentStory<typeof PointComposition> = args => (
  <PointComposition {...args} />
);

export const Mobile = Template.bind({});
Mobile.args = {
  points: "20000000",
  swapPoint: "20000000",
  positionPoint: "20000000",
  stakingPoint: "20000000",
  referralPoint: "20000000",
  isMobile: true,
};
Mobile.parameters = {
  theme: "light",
};

export const Web = Template.bind({});
Web.args = {
  points: "20000000",
  swapPoint: "20000000",
  positionPoint: "20000000",
  stakingPoint: "20000000",
  referralPoint: "20000000",
  isMobile: false,
};
Web.parameters = {
  theme: "light",
};
