import React, { useEffect } from "react";

import {
  convertSchemaJSONToItems,
  convertToLiquidVariables,
  copyToClipboard,
  generateJSONAndVariables,
  generateJSONSchema,
  sleep,
  _extractTextBetween,
  setJsonResult,
  clearResultsTextarea,
  cleanSectionCode,
  cleanJSONSchema,
} from "../utils";

import "./CodeTable.scss";
import useStore from "./../store/store";

export default function CodeTable() {
  const addItems = useStore((state) => state.addItems);
  const removeItems = useStore((state) => state.removeItems);

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
        <textarea
          defaultValue={variablesResult ? variablesResult : ""}
          value={variablesResult ? variablesResult : ""}
          readOnly={true}
          id="CodeTable-variables"
          cols="10"
          rows="10"></textarea>

        <div className="CodeTable-tables">
          <div className="CodeTable-tables-result">
            <textarea
              defaultValue={""}
              value={""}
              readOnly={false}
              name=""
              id="CodeTable-result"
              cols="30"
              rows="10"></textarea>
            <button onClick={() => copyJSONToClipboard()}>
              Copy to clipboard
            </button>
          </div>
          <div className="CodeTable-tables-wrapper">
            <textarea
              placeholder="Paste section code here"
              defaultValue=""
              name=""
              onChange={() => handleSectionCodeChange()}
              id="sectionCode"
              cols="30"
              rows="10"></textarea>
            <button
              onClick={async () => {
                localStorage.clear();
                convertSectionToJson();
                await sleep(100);
                const json = generateJSONSchema();
                setJsonResult(json);
                clearResultsTextarea();
              }}
              id="convertToJson"
              className="CodeTable-convert">
              Go
            </button>
          </div>

          <textarea
            defaultValue={""}
            readOnly={true}
            name=""
            placeholder="Result"
            id="sectionResult"
            cols="30"
            rows="10"></textarea>
        </div>

        <button
          onClick={() => {
            generateJSONAndVariables();
          }}>
          Generate JSON
        </button>

        <button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}>
          Clear
        </button>
      </div>
    </div>
  );
}
