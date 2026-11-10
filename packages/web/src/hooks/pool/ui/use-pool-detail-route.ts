import { createContext, useContext } from "react";

import useCustomRouter from "@hooks/common/use-custom-router";
import { PositionModel } from "@models/position/position-model";
import { isValidAddress } from "@utils/validation-utils";

export const PoolDetailPositionContext = createContext<Pick<PositionModel, "poolPath" | "owner" | "lpTokenId"> | null>(
  null,
);

export function usePoolDetailRoute() {
  const position = useContext(PoolDetailPositionContext);
  const router = useCustomRouter();
  const urlAddress = router.getAddress();
  const hash = router.asPath.split("#")[1] || "";

  return {
    poolPath: position?.poolPath ?? router.getPoolPath(),
    address: position?.owner ?? (urlAddress && isValidAddress(urlAddress) ? urlAddress : undefined),
    targetPositionId: position?.lpTokenId ?? (/^\d+$/.test(hash) ? hash : ""),
    isPositionLink: position !== null,
    hash,
  };
}
