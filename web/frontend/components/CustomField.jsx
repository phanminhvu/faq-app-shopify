import React from "react";

export default function CustomField({
  label,
  children,
  fullWidth = false,
  isFlex = false,
}) {
  return (
    <div className={isFlex ? "custom-field-flex" : ""}>
      <div>
        <div style={{ fontWeight: 400, marginBottom: isFlex ? "0" : "0.4rem" }}>
          {label}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
