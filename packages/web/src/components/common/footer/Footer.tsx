import React from "react";
import { wrapper } from "./Footer.styles";

interface FooterProps {
  label: string;
}

const Footer: React.FC<FooterProps> = ({ label }) => (
  <div css={wrapper}>
    <h2>Footer</h2>
    <p>{label}</p>
  </div>
);

export default Footer;
