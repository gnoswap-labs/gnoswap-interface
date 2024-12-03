import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { PoolMapper } from "@models/pool/mapper/pool-mapper";
import { IncentivizePoolModel } from "@models/pool/pool-model";
import POOLS from "@repositories/pool/mock/pools.json";

import IncentivizedPoolCard from "./IncentivizedPoolCard";

const pool = POOLS.pools[0] as unknown as IncentivizePoolModel;

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
