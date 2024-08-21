import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import MyDetailedPositionCard from "./MyDetailedPositionCard";
import { css } from "@emotion/react";
import { DEVICE_TYPE } from "@styles/media";

export default {
  title: "pool/MyDetailedPositionCard",
  component: MyDetailedPositionCard,
} as ComponentMeta<typeof MyDetailedPositionCard>;

const Template: ComponentStory<typeof MyDetailedPositionCard> = args => (
  <div css={wrapper}>
    <MyDetailedPositionCard {...args} />
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
