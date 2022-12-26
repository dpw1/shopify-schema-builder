import React, { useEffect, useState } from "react";

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

import "./CodeTable.scss";
import useStore from "./../store/store";
import { Button, TextField } from "@shopify/polaris";

export default function CodeTable() {
  const [importedSection, setImportedSection] = useState("");

  const addItems = useStore((state) => state.addItems);
  const removeItems = useStore((state) => state.removeItems);
  const sectionText = useStore((state) => state.sectionText);
  const setSectionText = useStore((state) => state.setSectionText);
  const addSection = useStore((state) => state.addSection);
  const items = useStore((state) => state.items);

  const [variables, setVariables] = useState(JSON.stringify(items));
  const [cssVariables, setCssVariables] = useState("");

  const convertSectionToJson = () => {
    const $code = window.document.querySelector(`#sectionCode`);

    try {
      const _code = $code.value;
      const code = _extractTextBetween(
        _code,
        `{% schema %}`,
        `{% endschema %}`,
      );

      const settings = convertSchemaJSONToItems(JSON.parse(code).settings);

      removeItems();
      addItems(settings);

      console.log(`my schema's settings: `, settings);
    } catch (err) {
      console.log("error in schema's settings: ", err);
    }
  };

  const handleSectionCodeChange = () => {
    const $section = document.querySelector(`#sectionCode`);

    const section = $section.value;

    addSection(section);
  };

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
      <div className="CodeTable-wrapper">
        <div className="CodeTable-box">
          <input
            checked={sectionText}
            onClick={() => {
              const update = !sectionText;
              setSectionText(update);

              setTimeout(() => {
                updateJSONAndVariables();
              }, 50);
            }}
            id="showSettings"
            type="checkbox"
          />
          <label htmlFor="showSettings">
            Remove <b>"sections."</b> from the variables
          </label>
        </div>
        <textarea
          value={variables}
          readOnly={true}
          id="CodeTable-variables"
          cols="10"
          rows="10"></textarea>

        <div className="CodeTable-tables">
          <div className="CodeTable-tables-result">
            <textarea value={JSON.stringify(items)} readOnly={false}></textarea>
          </div>
        </div>

        <button onClick={() => copyJSONToClipboard()}>Copy JSON</button>

        <button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}>
          Clear
        </button>

        <div>
          <TextField
            label={"Import section"}
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
        </div>

        <TextField
          label={"Import section"}
          value={importedSection}
          onChange={React.useCallback(
            (newValue) => setImportedSection(newValue),
            [],
          )}
          maxHeight={100}
          multiline={4}></TextField>
      </div>
      <button
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
      </button>
    </div>
  );
}
