import { TranslationKey } from "@constants/common.constant";
import React from "react";
import { BaseSEOContainer } from "./base-seo-container";

interface SwapSEOContainerProps {
  customTitle?: TranslationKey;
}

export const SwapSEOContainer = ({ customTitle }: SwapSEOContainerProps) => {
  return <BaseSEOContainer path="/swap" customTitle={customTitle} />;
};
