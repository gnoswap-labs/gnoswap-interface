import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import ViewProposalModal from "./ViewProposalModal";
import { DEVICE_TYPE } from "@styles/media";
import { action } from "@storybook/addon-actions";

export default {
  title: "governance/ViewProposalModal",
  component: ViewProposalModal,
} as ComponentMeta<typeof ViewProposalModal>;

const Template: ComponentStory<typeof ViewProposalModal> = args => (
  <ViewProposalModal {...args} />
);

export const Default = Template.bind({});
Default.args = {
  breakpoint: DEVICE_TYPE.WEB,
  proposalDetail: {
    id: "1",
    title: "#7 Proposal Title",
    label: "Community Pool Spend",
    status: "ACTIVE",
    timeEnd: "2023-08-01, 12:00:00 UTC+9",
    abstainOfQuorum: 30,
    noOfQuorum: 20,
    yesOfQuorum: 50,
    currentValue: 200000,
    maxValue: 400000,
    icon: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nisiorci, ultrices sit amet mi eget, efficitur elementum tellus. Integeraugue purus, rutrum eu pretium sit amet, varius in quam.Lorem ipsumdolor sit amet, consectetur adipiscing elit. Phasellus nisi orci,ultrices sit amet mi eget, efficitur elementum tellus. Integer auguepurus, rutrum eu pretium sit amet, varius in quam.Lorem ipsum dolor sitamet, consectetur adipiscing elit. Phasellus nisi orci, ultrices sitamet mi eget, efficitur elementum tellus. Integer augue purus, rutrum eupretium sit amet, varius in quam.Lorem ipsum dolor sit amet, consecteturadipiscing elit. Phasellus nisi orci, ultrices sit amet mi eget,efficitur elementum tellus. Integer augue purus, rutrum eu pretium sitamet, varius in quam.Lorem ipsum dolor sit amet, consectetur adipiscingelit. Phasellus nisi orci, ultrices sit amet mi eget, efficiturelementum tellus. Integer augue purus, rutrum eu pretium sit amet,varius in quam.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Phasellus nisi orci, ultrices sit amet mi eget, efficitur elementumtellus. Integer augue purus, rutrum eu pretium sit amet, varius inquam.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellusnisi orci, ultrices sit amet mi eget, efficitur elementum tellus.Integer augue purus, rutrum eu pretium sit amet, varius in quam.Loremipsum dolor sit amet, consectetur adipiscing elit. Phasellus nisi orci,ultrices sit amet mi eget, efficitur elementum tellus. Integer auguepurus, rutrum eu pretium sit amet, varius in quam.Lorem ipsum dolor sitamet, consectetur adipiscing elit. Phasellus nisi orci, ultrices sitamet mi eget, efficitur elementum tellus. Integer augue purus, rutrum eupretium sit amet, varius in quam.Lorem ipsum dolor sit amet, consecteturadipiscing elit. Phasellus nisi orci, ultrices sit amet mi eget,efficitur elementum tellus. Integer augue purus, rutrum eu pretium sitamet, varius in quam.Lorem ipsum dolor sit amet, consectetur adipiscingelit. Phasellus nisi orci, ultrices sit amet mi eget, efficiturelementum tellus. Integer augue purus, rutrum eu pretium sit amet,varius in quam.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Phasellus nisi orci, ultrices sit amet mi eget, efficitur elementumtellus. Integer augue purus, rutrum eu pretium sit amet, varius inquam.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellusnisi orci, ultrices sit amet mi eget, efficitur elementum tellus.Integer augue purus, rutrum eu pretium sit amet, varius in quam.Loremipsum dolor sit amet, consectetur adipiscing elit. Phasellus nisi orci,ultrices sit amet mi eget, efficitur elementum tellus. Integer auguepurus, rutrum eu pretium sit amet, varius in quam.Lorem ipsum dolor sitamet, consectetur adipiscing elit. Phasellus nisi orci, ultrices sitamet mi eget, efficitur elementum tellus. Integer augue purus, rutrum eupretium sit amet, varius in quam.",
    votingPower: 14245,
    currency: "USDC",
    typeVote: "",
  },
  setIsShowProposalModal: action("setIsShowProposalModal"),
};
