import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import DepositModal from "./DepositModal";
import { action } from "@storybook/addon-actions";
import { DEVICE_TYPE } from "@styles/media";

export default {
  title: "wallet/DepositModal",
  component: DepositModal,
} as ComponentMeta<typeof DepositModal>;

const Template: ComponentStory<typeof DepositModal> = args => (
  <DepositModal {...args} />
);

export const Default = Template.bind({});
Default.args = {
  breakpoint: DEVICE_TYPE.WEB,
  depositInfo: {
    chainId: "dev",
    createdAt: "2023-10-10T08:48:46+09:00",
    name: "Gnoswap",
    address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
    path: "gno.land/r/gnos",
    decimals: 4,
    symbol: "GNOT",
    logoURI:
      "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/gnot.svg",
    type: "grc20",
    priceId: "gno.land/r/gnos",
  },
  fromToken: {
    chainId: "dev",
    createdAt: "2023-10-10T08:48:46+09:00",
    name: "Gnoswap",
    address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
    path: "gno.land/r/gnos",
    decimals: 4,
    symbol: "GNOT",
    logoURI:
      "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/gnot.svg",
    type: "grc20",
    priceId: "gno.land/r/gnos",
  },
  toToken: {
    chainId: "dev",
    createdAt: "2023-10-10T08:48:46+09:00",
    name: "Gnoswap",
    address: "g1sqaft388ruvsseu97r04w4rr4szxkh4nn6xpax",
    path: "gno.land/r/gnos",
    decimals: 4,
    symbol: "GNOT",
    logoURI:
      "https://raw.githubusercontent.com/onbloc/gno-token-resource/main/gno-native/images/gnot.svg",
    type: "grc20",
    priceId: "gno.land/r/gnos",
  },
  connected: true,
  changeToken: action("changeToken"),
  close: action("close"),
};
