import React, { useState } from "react";
import PoolSelectionGraph from "./PoolSelectionGraph";
import { ComponentStory, Meta } from "@storybook/react";
import { tickToPrice } from "@utils/swap-utils";

export default {
  title: "common/PoolSelectionGraph",
  component: PoolSelectionGraph,
} as Meta<typeof PoolSelectionGraph>;

const buttonStyles = {
  width: "80px",
  height: "20px",
  margin: "5px 2px",
  backgroundColor: "#b5cfeb"
};

const Template: ComponentStory<typeof PoolSelectionGraph> = args => {
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [focusTick, setFocusTick] = useState<number | null>(tickToPrice(18));
  const [zoomLevel, setZoomLevel] = useState<number>(3);
  const [selectedFullRange] = useState(false);
  const width = 600;
  const height = 400;

  function zoomIn() {
    if (zoomLevel < 5) {
      setZoomLevel(zoomLevel + 1);
    }
  }

  function zoomOut() {
    if (zoomLevel > 0) {
      setZoomLevel(zoomLevel - 1);
    }
  }

  function moveFocus(move: number) {
    if (focusTick) {
      setFocusTick(focusTick + move);
    }
  }

  return (
    <>
      <div>
        <button style={buttonStyles} onClick={zoomIn}> zoomIn</button>
        <button style={buttonStyles} onClick={zoomOut}> zoomOut</button>
      </div>
      <div>
        <button style={buttonStyles} onClick={() => moveFocus(-10)}> moveLeft</button>
        <button style={buttonStyles} onClick={() => moveFocus(10)}> moveRight</button>
      </div>
      <PoolSelectionGraph
        {...args}
        width={width}
        height={height}
        minPrice={minPrice}
        maxPrice={maxPrice}
        setMinPrice={setMinPrice}
        setMaxPrice={setMaxPrice}
        zoomLevel={zoomLevel}
        selectedFullRange={selectedFullRange}
      />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {
  // zoomLevel: 0
};