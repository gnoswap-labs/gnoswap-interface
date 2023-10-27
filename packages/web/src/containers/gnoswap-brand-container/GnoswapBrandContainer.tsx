import GnoswapBrand, {
  SNS_TYPE,
} from "@components/home/gnoswap-brand/GnoswapBrand";
import React, { useCallback, useEffect, useState } from "react";

const SNS_URL: {
  [key in SNS_TYPE]: string;
} = {
  [SNS_TYPE.GITHUB]: "https://github.com/gnoswap-labs",
  [SNS_TYPE.GITBOOK]: "https://docs.gnoswap.io/",
  [SNS_TYPE.DISCODE]: "https://discord.gg/3YbdqVP8Tb",
  [SNS_TYPE.MEDIUM]: "https://medium.com/@gnoswaplabs",
  [SNS_TYPE.TWITTER]: "https://twitter.com/gnoswaplabs",
};

const GnoswapBrandContainer: React.FC = () => {
  const [width, setWidth] = useState(Number);
  const handleResize = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onClickSns = useCallback((snsType: SNS_TYPE) => {
    window.open(SNS_URL[snsType], "_blank");
  }, []);

  return <GnoswapBrand onClickSns={onClickSns} windowSize={width} />;
};

export default GnoswapBrandContainer;
