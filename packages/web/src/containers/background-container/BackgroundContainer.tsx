import { useBackground } from "@hooks/common/use-background";
import React, { PropsWithChildren } from "react";

const BackgroundContainer: React.FC<PropsWithChildren> = ({ children }) => {
  useBackground();

  return <>{children}</>;
};

export default BackgroundContainer;