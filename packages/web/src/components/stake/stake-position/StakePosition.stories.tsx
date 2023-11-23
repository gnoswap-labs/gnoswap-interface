import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import StakePosition from "./StakePosition";
import StakePositionContainer from "@containers/stake-position-container/StakePositionContainer";

export default {
  title: "stake/StakePosition",
  component: StakePosition,
} as ComponentMeta<typeof StakePosition>;

const Template: ComponentStory<typeof StakePosition> = () => {
  return <StakePositionContainer />;
};

export const Default = Template.bind({});
Default.args = {};
