import { fn } from "@storybook/test";
import SelectTokenBalance, { type SelectTokenBalanceProps } from "./SelectTokenBalance";
import { Meta, StoryObj } from "@storybook/nextjs";

const meta = {
  title: "common/SelectTokenBalance",
  component: SelectTokenBalance,
  tags: ["autodocs"],
} satisfies Meta<typeof SelectTokenBalance>;

export default meta;

const tokenA = {
  path: "0",
  name: "HEXss",
  symbol: "HEX",
  displaySymbol: "HEX",
  logoURI:
    "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
  balance: "1,234",
};

const tokenB = {
  path: "1",
  name: "USDCoin",
  symbol: "USDC",
  displaySymbol: "USDC",
  logoURI:
    "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
  balance: "1,234",
};

const tokens = [tokenA, tokenB, tokenA, tokenB];

export const Default: StoryObj<SelectTokenBalanceProps> = {
  args: {
    current: tokens[0],
    tokens,
    select: fn(),
  },
};
