import { action } from "@storybook/addon-actions";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { RefObject } from "react";

import { PoolMapper } from "@models/pool/mapper/pool-mapper";
import { IncentivizePoolModel } from "@models/pool/pool-model";
import POOLS from "@repositories/pool/mock/pools.json";

import IncentivizedPoolCardList from "../incentivized-pool-card-list/IncentivizedPoolCardList";
import EarnIncentivizedPools from "./EarnIncentivizedPools";

const pool = POOLS.pools[0] as unknown as IncentivizePoolModel;

const cardInfo = PoolMapper.toCardInfo(pool);

export default {
  title: "earn/EarnIncentivizedPools",
  component: EarnIncentivizedPools,
} as ComponentMeta<typeof EarnIncentivizedPools>;

const Template: ComponentStory<typeof EarnIncentivizedPools> = args => (
  <EarnIncentivizedPools
    {...args}
  />
);

export const Default = Template.bind({});
Default.args = {
  cardList: (
    <IncentivizedPoolCardList
      currentIndex={1}
      incentivizedPools={[cardInfo]}
      isPoolFetched={true}
      routeItem={action("routeItem")}
      mobile={false}
      loadMore={false}
      page={1}
      themeKey="dark"
      divRef={null as unknown as RefObject<HTMLDivElement>}
      onScroll={action("onScroll")}
      width={1440}
      showPagination={false}
      isLoading={false}
      checkStakedPool={() => true}
    />
  ),
};
