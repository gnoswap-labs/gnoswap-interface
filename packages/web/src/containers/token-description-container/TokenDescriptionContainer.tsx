import React, { useState, useEffect } from "react";
import TokenDescription from "@components/token/token-description/TokenDescription";
import { useRouter } from "next/router";
import TOKEN_LIST from "@repositories/token/mock/assets.json";

export interface DescriptionInfo {
  token: {
    name: string;
    symbol: string;
    image: string;
    pkg_path: string
    decimals: number
    description: string
    website_url: string
  };
  links: {
    Website: string;
    Gnoscan: string;
  };
}

export const descriptionInit: DescriptionInfo = {
  token: {
    pkg_path: "1",
    name: "Bitcoin",
    symbol: "BTC",
    image: "/gnos.svg",
    decimals: 1,
    description: "string",
    website_url: "string",
  },
  links: {
    Website: "gnoswap.io",
    Gnoscan: "gnoscan.io/tokens/r_demo_grc20_GNOS",
  },
};

const TokenDescriptionContainer: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [descriptionInfo, setDescriptionInfo] = useState<DescriptionInfo>(descriptionInit);
  const router = useRouter();
  useEffect(() => {
    const current = TOKEN_LIST.filter(item => item.symbol === router.query["token-path"])[0];
    if (current) {
      setDescriptionInfo(prev => ({
        ...prev,
        token: {
          ...current
        },
        links: {
          Website: current.website_url,
          Gnoscan: "gnoscan.io/tokens/r_demo_grc20_GNOS",
        }
      }));
    }
  }, [router.query]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <TokenDescription
      tokenName={descriptionInfo.token.name}
      tokenSymbol={descriptionInfo.token.symbol}
      content={descriptionInfo.token.description}
      links={descriptionInfo.links}
      loading={loading}
    />
  );
};

export default TokenDescriptionContainer;
