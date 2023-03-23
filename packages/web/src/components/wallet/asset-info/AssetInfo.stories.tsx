import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import AssetInfo from "./AssetInfo";

export default {
  title: "wallet/AssetList/AssetListTable/AssetInfo",
  component: AssetInfo,
} as ComponentMeta<typeof AssetInfo>;

const Template: ComponentStory<typeof AssetInfo> = args => (
  <div
    style={{
      color: "#FFF",
      backgroundColor: "#0A0E17",
    }}
  >
    <AssetInfo {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  asset: {
    id: "BTC",
    logoUri:
      "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
    type: "NATIVE",
    name: "Bitcoin",
    symbol: "BTC",
    chain: "Gnoland",
    balance: "0.000000",
  },
  deposit: action("deposit"),
  withdraw: action("withdraw"),
};
