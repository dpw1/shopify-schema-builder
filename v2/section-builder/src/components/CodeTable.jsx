import React, { useEffect, useState } from "react";

import {
  convertSchemaJSONToItems,
  convertToLiquidVariables,
  copyToClipboard,
  generateJSONSchema,
  sleep,
  _extractTextBetween,
  setJsonResult,
  clearResultsTextarea,
  cleanSectionCode,
  cleanJSONSchema,
  updateJSONAndVariables,
} from "../utils";

import "./CodeTable.scss";
import useStore from "./../store/store";
import { TextField } from "@shopify/polaris";

export default function CodeTable() {
  const [importedSection, setImportedSection] = useState("");

  const addItems = useStore((state) => state.addItems);
  const removeItems = useStore((state) => state.removeItems);
  const sectionText = useStore((state) => state.sectionText);
  const setSectionText = useStore((state) => state.setSectionText);
  const addSection = useStore((state) => state.addSection);

  const variablesResult = useStore((state) => state.variablesResult);

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

  const copySectionToClipboard = () => {
    const $section = document.querySelector(`#sectionResult`);
    const _section = $section.value;
    const section = cleanSectionCode(_section);

    copyToClipboard(section);
  };

  const copyJSONToClipboard = () => {
    const _json = generateJSONSchema();

    console.log(_json);
    const json = cleanJSONSchema(JSON.parse(_json));

    console.log("cleaned json", _json);

    copyToClipboard(json);
  };

  return (
    <div className="CodeTable">
      <div className="CodeTable-wrapper">
        <div className="CodeTable-checkbox">
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
          defaultValue={variablesResult ? variablesResult : ""}
          value={variablesResult ? variablesResult : ""}
          readOnly={true}
          id="CodeTable-variables"
          cols="10"
          rows="10"></textarea>

        <div className="CodeTable-tables">
          <div className="CodeTable-tables-result">
            {/* <textarea
              defaultValue={""}
              value={""}
              readOnly={false}
              name=""
              id="CodeTable-result"
              cols="30"
              rows="10"></textarea> */}
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

          console.log("extract", json);
          const op = convertSchemaJSONToItems(json);

          console.log("result", op);

          addItems(op);
        }}>
        Extract
      </button>
    </div>
  );
}
