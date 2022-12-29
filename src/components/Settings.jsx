import React, { useState, useCallback } from "react";
import { useStatePersist as useStickyState } from "use-state-persist";
import useStore from "./../store/store";
import {
  Button,
  TextField,
  Card,
  Tabs,
  Text,
  Checkbox,
  RadioButton,
  Stack,
} from "@shopify/polaris";

import "./Settings.scss";

export default function Settings() {
  const settings = useStore((state) => state.settings);
  const updateSettings = useStore((state) => state.updateSettings);
  const [variablesOrder, setVariablesOrder] = useState(
    settings.variablesOrder || "default",
  );
  const [checked, setChecked] = useState(false);
  const handleChange = useCallback((newChecked) => setChecked(newChecked), []);

  const handleVariablesOrderChange = (newValue) => {
    setVariablesOrder(newValue);
    updateSettings({
      variablesOrder: newValue,
    });
  };

  return (
    <div className="Settings">
      <Card>
        <div className="Settings-wrapper">
          <div className="Settings-options">
            <span className="Settings-subtitle">
              <Text variant="headingSm" as="h4">
                Variables order
              </Text>
            </span>

            <Stack vertical>
              <RadioButton
                label="Default"
                checked={variablesOrder === "default"}
                id="default"
                name="default"
                onChange={(_, e) => {
                  return handleVariablesOrderChange(e);
                }}
              />
              <RadioButton
                label="Order variables from A-Z"
                checked={variablesOrder === "a-z"}
                id="a-z"
                name="a-z"
                onChange={(_, e) => {
                  return handleVariablesOrderChange(e);
                }}
              />
              <RadioButton
                label="Order variables from Z-A"
                id="z-a"
                name="z-a"
                checked={variablesOrder === "z-a"}
                onChange={(_, e) => {
                  return handleVariablesOrderChange(e);
                }}
              />
            </Stack>
          </div>

          <div className="Settings-options">
            <span className="Settings-subtitle">
              <Text variant="headingSm" as="h4">
                Include variables:
              </Text>
            </span>

            <Stack vertical>
              <Checkbox
                label="Liquid"
                checked={true}
                onChange={() => {
                  return alert();
                }}
              />
              <Checkbox
                label="CSS"
                checked={true}
                onChange={() => {
                  return alert();
                }}
              />
              <Checkbox
                label="Javascript"
                checked={true}
                onChange={() => {
                  return alert();
                }}
              />
            </Stack>
          </div>
        </div>
      </Card>
    </div>
  );
}
