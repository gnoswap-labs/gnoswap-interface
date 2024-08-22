import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import AssetSendModal from "./AssetSendModal";
import { action } from "@storybook/addon-actions";
import { DEVICE_TYPE } from "@styles/media";

export default {
  title: "wallet/AssetSendModal",
  component: AssetSendModal,
} as ComponentMeta<typeof AssetSendModal>;

const Template: ComponentStory<typeof AssetSendModal> = args => (
  <AssetSendModal {...args} />
);

export const Default = Template.bind({});
Default.args = {
  breakpoint: DEVICE_TYPE.WEB,
  withdrawInfo: {
    chainId: "dev",
    createdAt: "2023-10-10T08:48:46+09:00",
    name: "Gnoswap",
    address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
    path: "gno.land/r/gns",
    decimals: 4,
    symbol: "GNOT",
    logoURI:
      "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/gnot.svg",
    type: "grc20",
    priceID: "gno.land/r/gns",
  },
  avgBlockTime: 2.2,
  connected: true,
  changeToken: action("changeToken"),
  close: action("close"),
};
