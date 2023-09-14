import TokenAmountInput, { type TokenAmountInputProps } from "./TokenAmountInput";
import { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { tokens } from "@repositories/token/mock/token-infos.json";
import { TokenRepositoryMock } from "@repositories/token";

export default {
  title: "common/TokenAmountInput",
  component: TokenAmountInput,
} as Meta<typeof TokenAmountInput>;

const token = {
  tokenId: "1",
  name: "Gnoland",
  symbol: "GNO.LAND",
  tokenLogo: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
};

export const Default: StoryObj<TokenAmountInputProps> = {
  args: {
    token,
    amount: "12,211",
    balance: "12,211",
    usdValue: "12.3",
    changable: true,
    changeBalance: action("changeBalance"),
    changeAmount: action("changeAmount"),
    changeToken: action("changeToken"),
  },
};