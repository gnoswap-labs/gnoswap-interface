import React from "react";
import TokenDescription from "@components/token/token-description/TokenDescription";

export const descriptionInit = {
  token: {
    path: "1",
    name: "Bitcoin",
    symbol: "BTC",
    logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/1.png",
  },
  desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nisi orci, ultrices sit amet mi eget, efficitur elementum tellus. Integer augue purus, rutrum eu pretium sit amet, varius in quam. In auctor gravida pretium. Maecenas est ante, pulvinar id accumsan eget, aliquam ac turpis. Donec vulputate nunc tellus. In sit amet mattis nisl. Mauris libero quam, hendrerit dapibus scelerisque eu, fringilla sit amet sapien. Proin ut semper risus. Vivamus fringilla eget lectus ut faucibus. Proin vitae mollis massa. Sed bibendum tortor eget aliquam commodo. Etiam et eleifend augue. Donec molestie placerat elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nisi orci, ultrices sit amet mi eget, efficitur elementum tellus. Integer augue purus, rutrum eu pretium sit amet, varius in quam. In auctor gravida pretium. Maecenas est ante, pulvinar id accumsan eget, aliquam ac turpis. Donec vulputate nunc tellus. In sit amet mattis nisl. Mauris libero quam, hendrerit dapibus scelerisque eu Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nisi orci, ultrices sit amet mi eget, efficitur elementum tellus. Integer augue purus, rutrum eu pretium sit amet, varius in quam. In auctor gravida pretium. Maecenas est ante, pulvinar id accumsan eget, aliquam ac turpis. Donec vulputate nunc tellus. In sit amet mattis nisl. Mauris libero quam, hendrerit dapibus scelerisque euetur adipiscing elit. Phasellus nisi orci, ultrices sit amet mi eget, efficitur elementum tellus. Integer augue purus, rutrum eu pretium sit amet, varius in quam. In auctor gravida pretium. Maecenas est ante, pulvinar id accumsan eget, aliquam ac turpis. Donec vulputate nunc tellus. In sit amet mattis nisl. Mauris libero quam, hendrerit dapibus scelerisque euetur adipiscing elit. Phasellus nisi orci, ultrices sit amet mi eget, efficitur elementum tellus. Integer augue purus, rutrum eu pretium sit amet, varius in quam. In auctor gravida pretium. Maecenas est ante, pulvinar id accumsan eget, aliquam ac turpis. Donec vulputate nunc tellus. In sit amet mattis nisl. Mauris libero quam, hendrerit dapibus scelerisque euetur adipiscing elit. Phasellus nisi orci, ultrices sit amet mi eget, efficitur elementum tellus. Integer augue purus, rutrum eu pretium sit amet, varius in quam. In auctor gravida pretium. Maecenas est ante, pulvinar id accumsan eget, aliquam ac turpis. Donec vulputate nunc tellus. In sit amet mattis nisl. Mauris libero quam, hendrerit dapibus scelerisque eu.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nisi orci, ultrices sit amet mi eget, efficitur elementum tellus. Integer augue purus, rutrum eu pretium sit amet, varius in quam. In auctor gravida pretium. Maecenas est ante, pulvinar id accumsan eget, aliquam ac turpis. Donec vulputate nunc tellus. In sit amet mattis nisl. Mauris libero quam, hendrerit dapibus scelerisque euetur adipiscing elit. Phasellus nisi orci, ultrices sit amet mi eget, efficitur elementum tellus. Integer augue purus, rutrum eu pretium sit amet, varius in quam. In auctor gravida pretium. Maecenas est ante, pulvinar id accumsan eget, aliquam ac turpis. Donec vulputate nunc tellus. In sit amet mattis nisl. Mauris libero quam, hendrerit dapibus scelerisque euetur adipiscing elit. Phasellus nisi orci, ultrices sit amet mi eget, efficitur elementum tellus. Integer augue purus, rutrum eu pretium sit amet, varius in quam. In auctor gravida pretium. Maecenas est ante, pulvinar id accumsan eget, aliquam ac turpis. Donec vulputate nunc tellus.",
  links: {
    Gnoscan: "gnoscan.io/tokens/r_demo_grc20_GNOS",
    Analytics: "info.gnoswap.io/tokens/r_demo_grc20_GNOS",
    Website: "gnoswap.io",
  },
};

const TokenDescriptionContainer: React.FC = () => {
  return (
    <TokenDescription
      tokenName={descriptionInit.token.name}
      tokenSymbol={descriptionInit.token.symbol}
      content={descriptionInit.desc}
      links={descriptionInit.links}
    />
  );
};

export default TokenDescriptionContainer;
