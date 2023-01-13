import React, { useState, useCallback, useEffect } from "react";
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
  const setSetting = useStore((state) => state.setSetting);
  const [variablesOrder, setVariablesOrder] = useState(
    settings.variablesOrder || "default",
  );
  const [checked, setChecked] = useState(false);
  const handleChange = useCallback((newChecked) => setChecked(newChecked), []);

  const [includeVariablesLiquid, setIncludeVariablesLiquid] = useStickyState(
    "@includeVariablesLiquid",
    true,
  );
  const [includeVariablesCSS, setIncludeVariablesCSS] = useStickyState(
    "@includeVariablesCSS",
    true,
  );
  const [includeVariablesJS, setIncludeVariablesJS] = useStickyState(
    "@includeVariablesJS",
    true,
  );

  const handleVariablesOrderChange = (newValue) => {
    setVariablesOrder(newValue);
    setSetting({
      variablesOrder: newValue,
    });
  };

  useEffect(() => {
    var variables = "";

    console.log("variables order", settings.variablesOrder);

    if (includeVariablesLiquid) {
      variables += "liquid|";
    }

    if (includeVariablesCSS) {
      variables += "css|";
    }

    if (includeVariablesJS) {
      variables += "js|";
    }

    variables = variables.split("|").filter((e) => e !== "");

    console.log(variables);
    setSetting({
      includeVariables: variables,
    });
  }, [includeVariablesLiquid, includeVariablesCSS, includeVariablesJS]);

  const handleIncludeVariablesChange = () => {};

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
                checked={includeVariablesLiquid}
                onChange={() => {
                  const value = !includeVariablesLiquid;
                  setIncludeVariablesLiquid(value);
                }}
              />
              <Checkbox
                label="CSS"
                checked={includeVariablesCSS}
                onChange={() => {
                  setIncludeVariablesCSS(!includeVariablesCSS);
                }}
              />
              <Checkbox
                label="Javascript"
                checked={includeVariablesJS}
                onChange={() => {
                  setIncludeVariablesJS(!includeVariablesJS);
                }}
              />
            </Stack>
          </div>
        </div>
      </Card>
    </div>
  );
}
