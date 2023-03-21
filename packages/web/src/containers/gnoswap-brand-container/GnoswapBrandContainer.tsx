import GnoswapBrand, {
  SNS_TYPE,
} from "@components/home/gnoswap-brand/GnoswapBrand";
import React, { useCallback } from "react";

const SNS_URL: {
  [key in SNS_TYPE]: string;
} = {
  [SNS_TYPE.GITHUB]: "https://github.com/gnoswap-labs/gnoswap",
  [SNS_TYPE.GITBOOK]: "https://docs.gnoswap.io",
  [SNS_TYPE.DISCODE]: "https://discord.gg",
  [SNS_TYPE.MEDIUM]: "https://medium.com",
  [SNS_TYPE.TWITTER]: "https://twitter.com",
};

const GnoswapBrandContainer: React.FC = () => {
  const onClickSns = useCallback((snsType: SNS_TYPE) => {
    window.open(SNS_URL[snsType]);
    // TODO: Check Spec
    // window.location.href = SNS_URL[snsType];
  }, []);

  return <GnoswapBrand onClickSns={onClickSns} />;
};

export default GnoswapBrandContainer;
