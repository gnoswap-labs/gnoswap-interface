import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { css } from "@emotion/react";
import { action } from "@storybook/addon-actions";

import SelectTokenModal from "./SelectTokenModal";
import { coinList } from "@containers/swap-container/SwapContainer";

export default {
  title: "swap/SelectTokenModal",
  component: SelectTokenModal,
} as ComponentMeta<typeof SelectTokenModal>;

const Template: ComponentStory<typeof SelectTokenModal> = args => (
  <div css={wrapper}>
    <div css={contentWrap}>
      <SelectTokenModal {...args} />
    </div>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  search: action("search"),
  onSelectTokenModal: action("onClick"),
  keyword: "",
  coinList: coinList(),
  changeToken: action("changeToken"),
};

const wrapper = () => css`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
`;

const contentWrap = () => css`
  width: 500px;
`;
