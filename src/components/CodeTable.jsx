import React, { useEffect, useState, useCallback } from "react";

import {
  convertSchemaJSONToItems,
  copyToClipboard,
  generateJSONSchema,
  sleep,
  _extractTextBetween,
  setJsonResult,
  clearResultsTextarea,
  cleanSectionCode,
  cleanJSONSchema,
  updateJSONAndVariables,
  generateLiquidVariables,
  generateCSSVariables,
} from "../utils";
import { useStatePersist as useStickyState } from "use-state-persist";

import "./CodeTable.scss";
import useStore from "./../store/store";
import { Button, TextField, Card, Tabs, Checkbox } from "@shopify/polaris";

export default function CodeTable() {
  const [importedSection, setImportedSection] = useState("");

  const addItems = useStore((state) => state.addItems);
  const removeItems = useStore((state) => state.removeItems);
  const addSection = useStore((state) => state.addSection);
  const items = useStore((state) => state.items);
  const [removeSectionText, setRemoveSectionText] = useState(false);

  const [variables, setVariables] = useState(JSON.stringify(items));
  const [cssVariables, setCssVariables] = useState("");

  const [selectedTab, setSelectedTab] = useStickyState("@tabs", 0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelectedTab(selectedTabIndex),
    [],
  );

  const tabs = [
    {
      id: "tab-schema-settings-json",
      content: "Schema's settings JSON",
      panelID: "schema-settings-json",
      component: (
        <>
          <TextField
            label={"Schema's settings JSON"}
            value={JSON.stringify(items)}
            maxHeight={100}
            multiline={4}></TextField>{" "}
          <Button onClick={() => copyJSONToClipboard()}>Copy JSON</Button>
          <Button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}>
            Clear
          </Button>
        </>
      ),
    },
    {
      id: "tab-liquid-variables",
      content: "Liquid variables",
      panelID: "all-customers-content-1",
      component: (
        <>
          <Checkbox
            label={
              <span>
                Remove <b>"sections."</b> from the variables
              </span>
            }
            checked={removeSectionText}
            onChange={() => {
              const update = !removeSectionText;
              setRemoveSectionText(update);

              const updated = generateLiquidVariables({
                removeSectionText: update,
              });

              setVariables(updated);
            }}></Checkbox>
          <TextField
            value={variables}
            readOnly={true}
            multiline={4}
            maxHeight={100}
            id="CodeTable-variables"
          />
        </>
      ),
    },

    {
      id: "tab-css-variables",
      content: "CSS Variables",
      panelID: "panel-css-variables",
      component: (
        <>
          <TextField
            value={cssVariables}
            maxHeight={100}
            multiline={4}></TextField>
          <Button
            onClick={() => {
              const css = generateCSSVariables();

              setCssVariables(css);
            }}>
            Generate CSS
          </Button>
        </>
      ),
    },
    {
      id: "tab-import-section",
      content: "Import",
      panelID: "panel-import-section",
      component: (
        <>
          <TextField
            value={importedSection}
            onChange={React.useCallback(
              (newValue) => setImportedSection(newValue),
              [],
            )}
            maxHeight={100}
            multiline={4}></TextField>
          <Button
            onClick={() => {
              function _extractTextBetween(text, start, end) {
                if (!start || !end) {
                  throw new Error(`Please add a "start" and "end" parameter`);
                }

                return text.split(start)[1].split(end)[0];
              }

              const _json = _extractTextBetween(
                importedSection,
                `{% schema %}`,
                `{% endschema %}`,
              );

              const json = JSON.parse(_json).settings;

              const extractedJson = convertSchemaJSONToItems(json);

              removeItems();
              addItems(extractedJson);
            }}>
            Import
          </Button>
        </>
      ),
    },
  ];

  const copyJSONToClipboard = () => {
    const items = useStore.getState().items;

    if (!items) {
      alert("no items.");
    }

    /* TODO 
	Json is copying wrong data (including  __id, etc) */
    var _json = JSON.stringify(items, null, 2);
    var json = cleanJSONSchema(JSON.parse(_json));

    copyToClipboard(json);
  };

  useEffect(() => {
    if (items && items.length >= 1) {
      const result = generateLiquidVariables();

      setVariables(result);
    }
  }, [items]);

  return (
    <div className="CodeTable">
      <Card>
        <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
          <Card.Section>{tabs[selectedTab].component}</Card.Section>
        </Tabs>
      </Card>
    </div>
  );
}
