import React from "react";
import { BaseSEOContainer } from "./base-seo-container";

interface SwapSEOContainerProps {
  customTitle?: string;
}

export const SwapSEOContainer = ({ customTitle }: SwapSEOContainerProps) => {
  return <BaseSEOContainer path="/swap" customTitle={customTitle} />;
};
