import { TokenState } from "@states/index";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { useExchange } from "@hooks/token/use-exchange";
import { useTokenResource } from "@hooks/token/use-token-resource";

export const useBackground = () => {
  const { updateTokenMetas } = useTokenResource();
  const { updateExchangeRates, updateUSDRate } = useExchange();

  const [standard, setStandard] = useAtom(TokenState.standardTokenMeta);

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
