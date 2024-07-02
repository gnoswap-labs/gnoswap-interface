import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import MyPositionCard from "./MyDetailedPositionCard";
import { css } from "@emotion/react";
import { DEVICE_TYPE } from "@styles/media";

export default {
  title: "pool/MyPositionCard",
  component: MyPositionCard,
} as ComponentMeta<typeof MyPositionCard>;

const Template: ComponentStory<typeof MyPositionCard> = args => (
  <div css={wrapper}>
    <MyPositionCard {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  breakpoint: DEVICE_TYPE.WEB,
};

const wrapper = () => css`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
`;
