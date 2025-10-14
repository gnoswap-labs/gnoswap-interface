import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import SearchInput from "./SearchInput";

const meta = {
  title: "common/SearchInput",
  component: SearchInput,
  tags: ["autodocs"],
} satisfies Meta<typeof SearchInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 400,
    height: 48,
    placeholder: "Search Input",
  },
  render: (args: React.ComponentProps<typeof SearchInput>) => {
    const [value, setValue] = useState("");
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value);

    return <SearchInput {...args} value={value} onChange={onChange} />;
  },
};

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    height: 48,
    placeholder: "Full Width",
  },
  render: (args: React.ComponentProps<typeof SearchInput>) => {
    const [value, setValue] = useState("");
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value);

    return <SearchInput {...args} value={value} onChange={onChange} />;
  },
};
