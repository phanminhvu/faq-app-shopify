import { TextField } from "@shopify/polaris";
import React, { useRef } from "react";
import { ChromePicker } from "react-color";
import { useOnClickOutside } from "../constants/function";
export default function CustomColorPicker({
  title,
  handleOpenSetColor,
  colorPagination,
  backgroundColor,
  nameKey,
  handleChangeSetColor,
  backgroundColorBackUp,
  isTitleLeft = true,
  label = "",
  disabled
}) {
  const colorPicker = useRef(null);
  const buttonPicker = useRef(null);

  const handleCloseColorPicker = () => {
    handleOpenSetColor(nameKey);
  };

  useOnClickOutside(colorPicker, handleCloseColorPicker, buttonPicker);

  return (
    <div style={{opacity: disabled ? '0.5' : '1'}}>
      {isTitleLeft && (
        <div>
          <div
            style={{
              marginBottom: "0.4rem",
              fontWeight: 400,
            }}
          >
            {title}
          </div>
        </div>
      )}
      {!isTitleLeft && (
        <div
          style={{
            marginBottom: "0",
            marginTop: "5px",
            marginLeft: "3px",
          }}
        >
          {label}
        </div>
      )}
      <div
        style={{
          display: "flex",
          position: "relative",
          marginTop: isTitleLeft ? "10px" : "5px",
        }}
      >
        <div
          ref={buttonPicker}
          onClick={() => {!disabled && handleOpenSetColor(nameKey)}}
          style={{
            marginRight: "5px",
            width: 36,
            height: 36,
            border: "1px solid #ccc",
            cursor: "pointer",
            borderRadius: "5px",
            backgroundColor: backgroundColor || backgroundColorBackUp,
          }}
        />
        <div style={{ width: "calc(100% - 41px)" }}>
          <TextField
            disabled
            value={backgroundColor || backgroundColorBackUp}
          />
        </div>
        {colorPagination[nameKey]?.visible && (
          <div
            ref={colorPicker}
            style={{
              position: "absolute",
              zIndex: 100,
              top: "38px",
            }}
          >
            <ChromePicker
              color={
                backgroundColor?.length === 7
                  ? backgroundColor
                  : backgroundColorBackUp
              }
              onChangeComplete={handleChangeSetColor(nameKey)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
