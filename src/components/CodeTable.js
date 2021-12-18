import React from "react";
import { useStatePersist as useStickyState } from "use-state-persist";
import {
  convertToLiquidVariables,
  copyToClipboard,
  generateJSONAndVariables,
  _extractTextBetween,
} from "../utils";

import "./CodeTable.scss";
import useStore from "./../store/store";

export default function CodeTable() {
  const [items, setItems] = useStickyState("@items");
  const [jsonResult, setJsonResult] = useStickyState("@jsonResult", null);
  const [variablesResult, setVariablesResult] = useStickyState(
    "@variablesResult",
    null,
  );
  const [values, setValues] = useStickyState("@values");

  const format = () => {
    if (!items || !values) {
      return;
    }
    let updated = [];
    items.map((item) => {
      return [...Object.entries(values)].map((_value, i) => {
        const key = _value[0];
        const value = _value[1];

        if (key.includes(item.id)) {
          let obj = {};
          obj["type"] = item.type;
          obj[key.split("_")[1]] = value;

          updated.push({
            type: item.type,
          });
        }
      });
    });

    return updated;
  };

  const convertSectionToJson = () => {
    const $code = window.document.querySelector(`#sectionCode`);

    try {
      const _code = $code.value;
      const code = _extractTextBetween(
        _code,
        `{% schema %}`,
        `{% endschema %}`,
      );
      const schema = JSON.parse(code).settings;

      console.log("my shcema", schema);
    } catch (err) {
      console.log("error in schema: ", err);
    }
  };

  return (
    <div className="CodeTable">
      <div className="CodeTable-wrapper">
        <textarea
          defaultValue={variablesResult ? variablesResult : ""}
          value={variablesResult}
          readOnly={true}
          id="CodeTable-variables"
          cols="10"
          rows="10"></textarea>

        <div className="CodeTable-tables">
          <textarea
            defaultValue={jsonResult ? jsonResult : ""}
            value={jsonResult}
            readOnly={false}
            name=""
            id="CodeTable-result"
            cols="30"
            rows="10"></textarea>
          <div className="CodeTable-tables-wrapper">
            <textarea
              placeholder="Paste section code here"
              defaultValue=""
              name=""
              id="sectionCode"
              cols="30"
              rows="10"></textarea>
            <button
              onClick={() => convertSectionToJson()}
              id="convertToJson"
              className="CodeTable-convert">
              Go
            </button>
          </div>
        </div>

        <button onClick={() => copyToClipboard(jsonResult)}>
          Copy to clipboard
        </button>

        <button
          onClick={() => {
            generateJSONAndVariables();
          }}>
          Generate JSON
        </button>
      </div>
    </div>
  );
}
