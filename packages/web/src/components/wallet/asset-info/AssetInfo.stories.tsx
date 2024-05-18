import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import AssetInfo from "./AssetInfo";
import { css, Theme } from "@emotion/react";
import { DEVICE_TYPE } from "@styles/media";

export default {
  title: "wallet/AssetList/AssetInfo",
  component: AssetInfo,
} as ComponentMeta<typeof AssetInfo>;

const Template: ComponentStory<typeof AssetInfo> = args => (
  <div css={wrapper}>
    <AssetInfo {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  asset: {
    type: "grc20",
    chainId: "dev",
    createdAt: "2023-12-12 23:45:12",
    name: "Bar",
    path: "gno.land/r/bar",
    decimals: 6,
    symbol: "BAR",
    logoURI:
      "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/grc20/images/gno_land_r_bar.svg",
    priceID: "gno.land/r/bar",
    priceId: "gno.land/r/bar",
    description: "this_is_desc_section",
    websiteURL: "https://website~~~~",
    balance: 0.0,
    price: "0",
  },
  deposit: action("deposit"),
  withdraw: action("withdraw"),
  breakpoint: DEVICE_TYPE.WEB,
};

const wrapper = (theme: Theme) => css`
  color: ${theme.color.text02};
`;
