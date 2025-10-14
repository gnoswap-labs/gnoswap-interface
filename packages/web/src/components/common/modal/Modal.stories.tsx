import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import Modal from "./Modal";
import Button, { ButtonHierarchy } from "@components/common/button/Button";

const meta = {
  title: "common/Modal",
  component: Modal,
  tags: ["autodocs"],
  decorators: [
    (Story: React.ComponentType) => (
      <>
        <Story />
        <div id="storybook-portal" />
      </>
    ),
  ],
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof Modal>;

const ModalWrapper = (args: React.ComponentProps<typeof Modal>) => {
  const [open, setOpen] = useState(true);
  const toggle = () => {
    setOpen(prev => !prev);
  };

  return (
    <>
      <Button
        text="Modal Open"
        onClick={toggle}
        style={{
          width: 200,
          height: 50,
          hierarchy: ButtonHierarchy.Primary,
        }}
      />
      {open && (
        <Modal
          {...args}
          exitClick={toggle}
          selector="storybook-portal"
          style={{ textColor: "background01", width: 500, height: 150 }}
        >
          <Button
            text="Modal Content 1"
            style={{
              fullWidth: true,
              height: 50,
              hierarchy: ButtonHierarchy.Primary,
            }}
          />
        </Modal>
      )}
    </>
  );
};

export const Default: Story = {
  render: (args: React.ComponentProps<typeof Modal>) => <ModalWrapper {...args} />,
  args: {},
};

export const LeftArrow: Story = {
  render: (args: React.ComponentProps<typeof Modal>) => <ModalWrapper {...args} />,
  args: {
    hasLeftArrow: true,
  },
};

export const LeftText: Story = {
  render: (args: React.ComponentProps<typeof Modal>) => <ModalWrapper {...args} />,
  args: {
    leftText: "Modal Header",
  },
};
