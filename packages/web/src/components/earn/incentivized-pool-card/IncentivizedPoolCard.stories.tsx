import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import IncentivizedPoolCard from "./IncentivizedPoolCard";
import { action } from "@storybook/addon-actions";
import POOLS from "@repositories/pool/mock/pools.json";
import { PoolMapper } from "@models/pool/mapper/pool-mapper";
import { PoolModel } from "@models/pool/pool-model";

const pool = POOLS.pools[0] as PoolModel;

const cardInfo = PoolMapper.toCardInfo(pool);

export default {
  title: "earn/IncentivizedPoolCard",
  component: IncentivizedPoolCard,
} as ComponentMeta<typeof IncentivizedPoolCard>;

const Template: ComponentStory<typeof IncentivizedPoolCard> = args => {
  return <IncentivizedPoolCard {...args} pool={cardInfo} />;
};

export const Default = Template.bind({});
Default.args = {
  routeItem: action("routeItem"),
};
