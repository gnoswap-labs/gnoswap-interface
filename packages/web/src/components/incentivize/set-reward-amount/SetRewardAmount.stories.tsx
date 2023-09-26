import React, { useCallback, useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import SetRewardAmount from "./SetRewardAmount";

const tokenA = {
  path: "0",
  name: "HEXss",
  symbol: "HEX",
  logoURI: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
  balance: "1,234",
};

const tokenB = {
  path: "1",
  name: "USDCoin",
  symbol: "USDC",
  logoURI: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
  balance: "1,234",
};

const tokens = [tokenA, tokenB];

export default {
  title: "incentivize/SetRewardAmount",
  component: SetRewardAmount,
} as ComponentMeta<typeof SetRewardAmount>;

const Template: ComponentStory<typeof SetRewardAmount> = args => {
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState(tokenA);

  const onChangeAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setAmount(value);
    },
    [],
  );

  const selectToken = useCallback((path: string) => {
    const token = tokens.find(token => token.path === path);
    if (token) {
      setToken(token);
    }
  }, []);

  return (
    <SetRewardAmount
      {...args}
      token={token}
      tokens={tokens}
      amount={amount}
      selectToken={selectToken}
      onChangeAmount={onChangeAmount}
    />
  );
};

export const Default = Template.bind({});
Default.args = {};
