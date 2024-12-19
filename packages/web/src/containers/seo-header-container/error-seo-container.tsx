import React from "react";
import { BaseSEOContainer } from "./base-seo-container";

export const Error404SEOContainer = () => {
  return <BaseSEOContainer path="/404" />;
};

export const Error500SEOContainer = () => {
  return <BaseSEOContainer path="/500" />;
};
