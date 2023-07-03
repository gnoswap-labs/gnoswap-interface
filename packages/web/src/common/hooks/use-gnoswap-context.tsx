import { useContext } from "react";
import { CommonError } from "../errors";
import { GnoswapContext } from "../providers";

export const useGnoswapContext = () => {
  const context = useContext(GnoswapContext);
  if (context === null) {
    throw new CommonError("FAILED_INITIALIZE_PROVIDER");
  }
  return context;
};
