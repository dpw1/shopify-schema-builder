import React from "react";
import { useStatePersist as useStickyState } from "use-state-persist";
import { convertToLiquidVariables, copyToClipboard } from "../utils";

import "./CodeTable.scss";

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

        <textarea
          defaultValue={jsonResult ? jsonResult : ""}
          value={jsonResult}
          readOnly={true}
          name=""
          id="CodeTable-result"
          cols="30"
          rows="10"></textarea>

        <button onClick={() => copyToClipboard(jsonResult)}>
          Copy to clipboard
        </button>

        <button
          onClick={() => {
            const $generator = window.document.getElementById("generateJSON");

            if ($generator) {
              $generator.click();
            }
          }}>
          Generate JSON
        </button>
      </div>
    </div>
  );
}
