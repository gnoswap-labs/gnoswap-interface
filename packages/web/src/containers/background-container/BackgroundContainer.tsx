import { useBackground } from "@hooks/common/use-background";
import { useEmitTransactionEvents } from "@query/common/use-emit-transaction-events";
import React, { PropsWithChildren } from "react";

const BackgroundContainer: React.FC<PropsWithChildren> = ({ children }) => {
  useBackground();
  useEmitTransactionEvents();

  return <>{children}</>;
};

export default BackgroundContainer;
