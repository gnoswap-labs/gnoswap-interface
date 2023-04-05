import React from "react";

import MyPositionCardList from "@components/common/my-position-card-list/MyPositionCardList";

const WalletPositionCardListContainer: React.FC = () => (
  <MyPositionCardList list={[]} loadMore={false} />
);

export default WalletPositionCardListContainer;
