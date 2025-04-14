import { EXT_URL } from "@constants/external-url.contant";

import { Anchor, Flex } from "./LearnMore.styles";
import IconNote from "@components/common/icons/IconNote";

export default function LearnMore() {
  return (
    <Anchor href={EXT_URL.DOCS.USER_GUIDE.LEADERBOARD} target="_blank" rel="noreferrer">
      <Flex>
        <span>Learn More</span>
        <IconNote className="icon-logo" />
      </Flex>
    </Anchor>
  );
}
