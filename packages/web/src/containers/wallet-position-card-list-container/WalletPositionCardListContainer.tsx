import React from "react";

import MyPositionCardList from "@components/common/my-position-card-list/MyPositionCardList";

const WalletPositionCardListContainer: React.FC = () => (
  <MyPositionCardList list={[]} isFetched={true} />
);

export default WalletPositionCardListContainer;
