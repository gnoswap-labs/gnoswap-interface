import React from "react";

import { SEOInfo } from "@constants/common.constant";
import { nullish } from "@utils/nullish-utils";

import SEOHeader from "@components/common/seo-header/seo-header";

type PageKey = keyof typeof SEOInfo;

interface BaseSEOProps {
  path: PageKey;
  titleParams?: (string | undefined)[];
  descParams?: (string | undefined)[];
  ogTitleParams?: (string | undefined)[];
  customTitle?: string;
}

export const BaseSEOContainer = ({
  path,
  titleParams = [],
  descParams = [],
  ogTitleParams = [],
  customTitle,
}: BaseSEOProps) => {
  const seoInfo = SEOInfo[path];

  return (
    <SEOHeader
      title={nullish.handleFalsy(customTitle, seoInfo.title(titleParams))}
      pageDescription={seoInfo.desc(descParams)}
      ogTitle={seoInfo.ogTitle?.(ogTitleParams)}
      ogDescription={seoInfo.ogDesc?.()}
    />
  );
};
