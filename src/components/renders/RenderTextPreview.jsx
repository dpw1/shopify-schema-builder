import React from "react";
import { Select, RangeSlider, TextField, Button, Text } from "@shopify/polaris";

export default function RenderTextPreview(props) {
  const _data = JSON.parse(props.data);

  const data = _data.props;

  return (
    <>
      <TextField
        autoComplete={"off"}
        label={data.label}
        helpText={data.info}
        placeholder={data.placeholder}
        value={data.default}></TextField>
    </>
  );
}
