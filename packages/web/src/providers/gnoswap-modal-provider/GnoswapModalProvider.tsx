"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export interface PortalProps {
  children: React.ReactNode;
  selector?: string;
}

const GnoswapModalProvider: React.FC<PortalProps> = ({ children, selector }) => {
  const [element, setElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setElement(document.getElementById(selector ?? "portal-root"));
  }, [selector]);

  // Only React components will come in here.
  /* eslint-disable @typescript-eslint/no-explicit-any */
  return <>{element ? createPortal(children as any, element) : null}</>;
};

export default GnoswapModalProvider;
