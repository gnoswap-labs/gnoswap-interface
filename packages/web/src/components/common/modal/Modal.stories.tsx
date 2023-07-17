import React, { useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import Modal from "./Modal";
import Button, { ButtonHierarchy } from "@components/common/button/Button";

export default {
  title: "common/Modal",
  component: Modal,
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = args => {
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
      <div id="storybook-portal" />
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

export const Default = Template.bind({});
Default.args = {};

export const LeftArrow = Template.bind({});
LeftArrow.args = {
  hasLeftArrow: true,
};

export const LeftText = Template.bind({});
LeftText.args = {
  leftText: "Modal Header",
};
