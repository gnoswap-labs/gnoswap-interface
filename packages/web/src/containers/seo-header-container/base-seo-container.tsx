import React from "react";

import { SEOInfo, TranslationKey, TranslationWithValues } from "@constants/common.constant";
import { nullish } from "@utils/nullish-utils";

import SEOHeader from "@components/common/seo-header/seo-header";
import { useTranslation } from "react-i18next";

type PageKey = keyof typeof SEOInfo;

interface BaseSEOProps {
  path: PageKey;
  titleParams?: (string | undefined)[];
  descParams?: (string | undefined)[];
  ogTitleParams?: (string | undefined)[];
  customTitle?: string | TranslationKey;
}

export const BaseSEOContainer = ({
  path,
  titleParams = [],
  descParams = [],
  ogTitleParams = [],
  customTitle,
}: BaseSEOProps) => {
  const { t } = useTranslation();
  const seoInfo = SEOInfo[path];

  const getTranslatedContent = (content: string | TranslationWithValues): string => {
    if (typeof content === "object" && "i18nKey" in content) {
      return t(content.i18nKey, content.values);
    }
    if (content.startsWith("Metatag")) {
      return t(content);
    }

    return String(content);
  };

  const title = String(
    nullish.handleEmpty(getTranslatedContent(customTitle || ""), getTranslatedContent(seoInfo.title(titleParams))),
  );

  return (
    <SEOHeader
      title={title}
      pageDescription={seoInfo.desc(descParams)}
      ogTitle={seoInfo.ogTitle?.(ogTitleParams)}
      ogDescription={seoInfo.ogDesc?.()}
    />
  );
};
