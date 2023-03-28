import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { TokenState } from "@/states";
import { useExchange } from "./use-exchange";
import { useTokenResource } from "./use-token-resource";

export const useBackground = () => {
  const { updateTokenMetas } = useTokenResource();
  const { updateExchangeRates, updateUSDRate } = useExchange();

  const [standard, setStandard] = useRecoilState(TokenState.standard);

  useEffect(() => {
    initStandardToken();
    updateTokenMetas();
  });

  useEffect(() => {
    if (!standard) {
      return;
    }
    console.log("BACKGROUND FETCH");
    updateExchangeRates();
    updateUSDRate();
  }, [standard, updateExchangeRates, updateUSDRate]);

  const initStandardToken = () => {
    setStandard({
      token_id: "1",
      name: "GNO.LAND",
      symbol: "GNOLAND",
      decimals: 6,
      denom: "GNOT",
      minimal_denom: "ugnot",
    });
  };

  return;
};
