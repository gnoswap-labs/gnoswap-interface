import type { Meta, StoryObj } from "@storybook/nextjs";
import TableSkeleton from "./TableSkeleton";
import { SHAPE_TYPES, TABLE_TITLE } from "@constants/skeleton.constant";

const meta = {
  title: "common/TableSkeleton",
  component: TableSkeleton,
  tags: ["autodocs"],
} satisfies Meta<typeof TableSkeleton>;

export default meta;
type Story = StoryObj<typeof TableSkeleton>;

export const Default: Story = {
  args: {
    info: {
      title: TABLE_TITLE.POOL_TABLE,
      total: 5,
      list: [
        {
          width: 161,
          type: SHAPE_TYPES.ROUNDED_SQUARE,
          left: true,
          className: "",
          skeletonWidth: 161,
        },
        {
          width: 120,
          type: SHAPE_TYPES.ROUNDED_SQUARE,
          left: false,
          className: "",
          skeletonWidth: 120,
        },
        {
          width: 120,
          type: SHAPE_TYPES.ROUNDED_SQUARE,
          left: false,
          className: "",
          skeletonWidth: 120,
        },
        {
          width: 120,
          type: SHAPE_TYPES.ROUNDED_SQUARE,
          left: false,
          className: "",
          skeletonWidth: 120,
        },
        {
          width: 80,
          type: SHAPE_TYPES.ROUNDED_SQUARE,
          left: false,
          className: "",
          skeletonWidth: 80,
        },
        {
          width: 20,
          type: SHAPE_TYPES.CIRCLE,
          left: false,
          className: "",
          skeletonWidth: 20,
        },
      ],
    },
  },
};
