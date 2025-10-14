import type { Meta, StoryObj } from "@storybook/nextjs";
import Button, { ButtonHierarchy } from "./Button";
import IconDownload from "@components/common/icons/IconDownload";
import IconStrokeArrowDown from "@components/common/icons/IconStrokeArrowDown";

const meta = {
  title: "common/Button",
  component: Button,
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    text: "Primary",
    style: {
      hierarchy: ButtonHierarchy.Primary,
      width: 130,
      height: 50,
    },
  },
};

export const Dark: Story = {
  args: {
    text: "Dark",
    style: {
      hierarchy: ButtonHierarchy.Dark,
      width: 130,
      height: 50,
    },
  },
};

export const LeftIconButton: Story = {
  args: {
    leftIcon: <IconDownload />,
    text: "Left Icon Button",
    style: {
      bgColor: "background02",
      width: 180,
      height: 50,
      justify: "space-between",
      padding: "0px 10px",
      textColor: "text01",
    },
  },
};

export const RightIconButton: Story = {
  args: {
    rightIcon: <IconStrokeArrowDown />,
    text: "Right Icon Button",
    style: {
      bgColor: "background01",
      width: 180,
      height: 50,
      justify: "space-between",
      padding: "0px 10px",
      textColor: "text01",
    },
  },
};

export const FullWidthButton: Story = {
  args: {
    text: "Full Width Button",
    style: {
      bgColor: "background03",
      fullWidth: true,
      height: 50,
      textColor: "text01",
    },
  },
};
