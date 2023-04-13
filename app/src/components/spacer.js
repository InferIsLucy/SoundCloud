import React from "react";
import { View } from "react-native";

const sizeVariant = {
  small: 1,
  medium: 2,
  large: 3,
  huge: 4,
};
const positionVariant = {
  top: "marginTop",
  left: "marginLeft",
  right: "marginRight",
  bottom: "marginBottom",
};

const getValueFromSize = (sizeVariant) => {
  switch (sizeVariant) {
    case "small":
      return 8;
    case "medium":
      return 12;
    case "large":
      return 18;
    case "huge":
      return 24;
  }
};
const getPosition = (positionVariant) => {
  switch (positionVariant) {
    case "top":
      return "marginTop";
    case "left":
      return "marginLeft";
    case "bottom":
      return "marginBottom";
    case "right":
      return "marginRight";
  }
};

export const Spacer = ({ position, size }) => {
  const value = getValueFromSize(size);
  const marginType = getPosition(position);

  return (
    <View
      style={{
        [marginType]: value,
      }}
    ></View>
  );
};

Spacer.defaultProps = {
  position: "top",
  size: "small",
};
