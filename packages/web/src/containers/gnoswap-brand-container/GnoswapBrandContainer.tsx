import React, { useCallback, useEffect, useState } from "react";

import GnoswapBrand, {
  SNS_TYPE,
} from "@components/home/gnoswap-brand/GnoswapBrand";
import { EXT_URL } from "@constants/external-url.contant";

const SNS_URL: {
  [key in SNS_TYPE]: string;
} = {
  [SNS_TYPE.GITHUB]: EXT_URL.GITHUB.ROOT,
  [SNS_TYPE.GITBOOK]: EXT_URL.DOCS.ROOT,
  [SNS_TYPE.DISCORD]: EXT_URL.SOCIAL.DISCORD,
  [SNS_TYPE.TELEGRAM]: EXT_URL.SOCIAL.TELEGRAM,
  [SNS_TYPE.MEDIUM]: EXT_URL.SOCIAL.MEDIUM,
  [SNS_TYPE.TWITTER]: EXT_URL.SOCIAL.TWITTER,
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
