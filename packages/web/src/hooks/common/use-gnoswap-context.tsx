import { useContext } from "react";
import { GnoswapContext } from "@providers/gnoswap-service-provider/GnoswapServiceProvider";
import { CommonError } from "@common/errors";

export const useGnoswapContext = () => {
  const context = useContext(GnoswapContext);
  if (context === null) {
    throw new CommonError("FAILED_INITIALIZE_PROVIDER");
  }
  return context;
};