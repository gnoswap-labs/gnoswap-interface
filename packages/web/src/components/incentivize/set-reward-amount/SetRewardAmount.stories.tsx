import React, { useCallback, useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import SetRewardAmount from "./SetRewardAmount";

const token0 = {
  tokenId: "0",
  name: "HEXss",
  symbol: "HEX",
  tokenLogo: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
  balance: "1,234",
};

const token1 = {
  tokenId: "1",
  name: "USDCoin",
  symbol: "USDC",
  tokenLogo: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39/logo.png",
  balance: "1,234",
};

const tokens = [token0, token1];

export default {
  title: "incentivize/SetRewardAmount",
  component: SetRewardAmount,
} as ComponentMeta<typeof SetRewardAmount>;

const Template: ComponentStory<typeof SetRewardAmount> = args => {
  const [amount, setAmount] = useState("");
  const [token, setToken] = useState(token0);

  const onChangeAmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setAmount(value);
    },
    [],
  );

  const selectToken = useCallback((tokenId: string) => {
    const token = tokens.find(token => token.tokenId === tokenId);
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
