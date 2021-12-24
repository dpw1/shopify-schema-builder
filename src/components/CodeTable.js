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
} from "../utils";

import "./CodeTable.scss";
import useStore from "./../store/store";

export default function CodeTable() {
  const addItems = useStore((state) => state.addItems);
  const removeItems = useStore((state) => state.removeItems);
  const section = useStore((state) => state.section);
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

      const schema = convertSchemaJSONToItems(JSON.parse(code).settings);

      removeItems();
      addItems(schema);

      console.log("my schema", schema);
    } catch (err) {
      console.log("error in schema: ", err);
    }
  };

  const handleSectionCodeChange = () => {
    const $section = document.querySelector(`#sectionCode`);

    const section = $section.value;

    addSection(section);
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
          <textarea
            defaultValue={""}
            value={""}
            readOnly={false}
            name=""
            id="CodeTable-result"
            cols="30"
            rows="10"></textarea>
          <div className="CodeTable-tables-wrapper">
            <textarea
              placeholder="Paste section code here"
              value={`<p> hello i start here {{ section.settings.margin-top }} </p>

              {% schema %}
              {
              "name": "Premium Navbar TESTING",
              "class": "premium-navbar-section",
              "settings": [
              {
              "type": "paragraph",
              "content": "All images should be 65 x 65px."
              },
                   {
                        "type":      "range",
                        "id":        "margin-top",
                        "min":       -40,
                        "max":        50,
                        "step":       1,
                        "unit":       "px",
                        "label":     "Spacing Top",
                    "info": "Default: 0",
                        "default":   0
                    },
                   {
                        "type":      "range",
                        "id":        "margin-bottom",
                        "min":       -40,
                        "max":        50,
                        "step":       1,
                        "unit":       "px",
                        "label":     "Spacing Bottom",
                      "info": "Default: 0",
                        "default":   0
                    },
                    {
                      "type": "checkbox",
                      "id": "display-collections-ok",
                      "label": "Display all collections",
                  "info": "Check this to display all of your collections automatically.",
                  "default": true
                    },
                {
                  "type": "richtext",
                  "id": "hello",
                  "label": "Richtext",
                  "default": "<p>welcome</p>"
                }
              
              ],
              "blocks": [
                  {
                    "type": "select",
                    "name": "New Item",
                    "settings": [
                       {
                      "type": "image_picker",
                      "id": "image",
                      "label": "Image"
                      },
               {
                      "type": "url",
                      "id": "link",
                      "label": "URL"
                    },
                      {
                        "id": "text",
                        "type": "text",
                        "label": "Text"
                      }
                    ]
                  }
                ],
              "presets": [
              {
              "name": "Premium Navbar TESTING",
              "category": "Custom"
              }
              ]
              }
              {% endschema %}
              
              <p>we ends here yoyo</p>`}
              defaultValue=""
              name=""
              onChange={() => handleSectionCodeChange()}
              id="sectionCode"
              cols="30"
              rows="10"></textarea>
            <button
              onClick={async () => {
                convertSectionToJson();
                await sleep(100);
                const json = generateJSONSchema();
                setJsonResult(json);
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

        <button onClick={() => copyToClipboard()}>Copy to clipboard</button>

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
