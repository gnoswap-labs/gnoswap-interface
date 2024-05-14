import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import WithDrawModal from "./WithDrawModal";
import { action } from "@storybook/addon-actions";
import { DEVICE_TYPE } from "@styles/media";

export default {
  title: "wallet/WithDrawModal",
  component: WithDrawModal,
} as ComponentMeta<typeof WithDrawModal>;

const Template: ComponentStory<typeof WithDrawModal> = args => (
  <WithDrawModal {...args} />
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
    priceId: "gno.land/r/gns",
  },
  connected: true,
  changeToken: action("changeToken"),
  close: action("close"),
};
