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
  extractSchemaJSONFromCodeString,
  updateJSONAndVariables,
  generateJavascriptVariables,
  extractTextBetween,
  generateLiquidVariables,
  generateCSSVariables,
  replaceTextBetween,
  convertToLiquidVariables,
  mergeEzfyVariablesToCode,
  insertLiquidVariableInHtml,
  filterItemsWithProperty,
} from "../utils";
import { useStatePersist as useStickyState } from "use-state-persist";

import "./CodeTable.scss";
import useStore from "./../store/store";
import { Button, TextField, Card, Tabs, Checkbox } from "@shopify/polaris";
import Settings from "./Settings";
import ConfirmDialog from "./ConfirmDialog";

export default function CodeTable() {
  const [importedSection, setImportedSection] = useStickyState(
    "@importedSection",
    "",
  );

  const addItems = useStore((state) => state.addItems);
  const removeItems = useStore((state) => state.removeItems);
  const settings = useStore((state) => state.settings);
  const addSection = useStore((state) => state.addSection);
  const items = useStore((state) => state.items);
  const [removeSectionText, setRemoveSectionText] = useState(false);

  const [variables, setVariables] = useState(JSON.stringify(items));
  const [cssVariables, setCssVariables] = useState("");

  const [selectedTab, setSelectedTab] = useStickyState("@tabs", 3);
  const [removeAll, setRemoveAll] = useState(false);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelectedTab(selectedTabIndex),
    [],
  );

  const tabs = [
    {
      id: "tab-schema-settings-json",
      content: "Sches settings JSON",
      panelID: "schema-settings-json",
      component: (
        <>
          <TextField
            label={"Schema's settings JSON"}
            value={JSON.stringify(items)}
            maxHeight={100}
            multiline={4}></TextField>{" "}
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
              if (!importedSection) {
                alert("no imported section;");
              }

              const json =
                extractSchemaJSONFromCodeString(importedSection).settings;

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

  function generateSectionCodeWithUpdatedSchema() {
    let _items = useStore.getState().items;

    const originalImportSchema =
      extractSchemaJSONFromCodeString(importedSection);
    const updatedImportSchema = { ...originalImportSchema };

    let updatedSettings = JSON.parse(`[${cleanJSONSchema(_items)}]`);

    updatedImportSchema.settings = updatedSettings;

    const _updated = replaceTextBetween(
      importedSection,
      `{% schema %}`,
      `{% endschema %}`,
      JSON.stringify(updatedImportSchema, null, 2),
    );

    return _updated;
  }

  return (
    <div className="CodeTable">
      <Card>
        <Tabs tabs={tabs} selected={selectedTab} onSelect={handleTabChange}>
          <Card.Section>{tabs[selectedTab].component}</Card.Section>
        </Tabs>
      </Card>

      <Card>
        <div className="CodeTable-buttons">
          <Button onClick={() => copyJSONToClipboard()}>
            Copy Schema Settings
          </Button>
          <Button
            disabled={importedSection.trim().length <= 0}
            onClick={() => {
              let code;

              code = generateSectionCodeWithUpdatedSchema();

              code = mergeEzfyVariablesToCode(code);

              /* Check if there are variables to inject in the HTML */
              const injectables = filterItemsWithProperty(
                items,
                "injectVariableInHTMLSelector",
              );

              if (injectables) {
                for (var each of injectables) {
                  code = insertLiquidVariableInHtml(
                    code,
                    each.injectVariableInHTMLSelector,
                    `{{ ${each.id} }}`,
                  );
                }
              }

              copyToClipboard(code);

              return;
            }}>
            Copy updated imported code
          </Button>

          <Button
            onClick={() => {
              const variables = convertToLiquidVariables(
                items,
                settings.variablesOrder,
              );

              copyToClipboard(variables);

              return;
            }}>
            Copy Liquid variables
          </Button>
          <Button
            onClick={() => {
              const css = generateCSSVariables(items, settings.variablesOrder);

              copyToClipboard(css);
            }}>
            Copy CSS variables
          </Button>
          <Button
            onClick={() => {
              const js = generateJavascriptVariables(
                items,
                settings.variablesOrder,
              );

              copyToClipboard(js);
            }}>
            Copy JS variables
          </Button>
          <Button
            onClick={(_) => {
              setRemoveAll(true);
            }}>
            Clear
          </Button>
        </div>
      </Card>

      {removeAll && (
        <ConfirmDialog
          title={"Delete everything?"}
          message={`Clicking "yes" will delete all the code you have in here and clear the cache.`}
          handleConfirm={() => {
            localStorage.clear();
            window.location.reload();
            setRemoveAll(false);
          }}
          handleDeny={() => {
            setRemoveAll(false);
          }}></ConfirmDialog>
      )}

      <Settings></Settings>
    </div>
  );
}
