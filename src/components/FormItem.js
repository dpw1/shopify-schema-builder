import React, { useState, useEffect } from "react";

import { useStatePersist as useStickyState } from "use-state-persist";
import short from "short-uuid";
import "./FormItem.scss";
import {
  generateJSONAndVariables,
  generateJSONSchema,
  updateJSONTextarea,
} from "../utils";

export default function FormItem(props) {
  const [modified, setModified] = useState(false);

  let {
    itemId,
    type,
    options,
    duplicatedOptions,
    defaultOptions,
    subOptions,
    totalSubOptions,
    itemCount,
  } = props;

  let defaultTitle = "";

  // generateJSONAndVariables();

  if (!defaultOptions || defaultOptions.length <= 0) {
    defaultOptions = "";
  }

  if (duplicatedOptions) {
    defaultOptions = duplicatedOptions;
  }

  console.log("xxx", defaultOptions);

  if (defaultOptions["id"] !== "") {
    defaultTitle = defaultOptions["id"];
  }

  console.log("Our default options.", defaultOptions);
  console.log("Our duplicated options.", duplicatedOptions);

  const initialValues = () => {
    let data = {};

    options.map((e) => {
      const str = `${itemId}_${e}`;

      return (data[str] = "");
    });

    return data;
  };

  const [values, setValues] = useStickyState("@values", initialValues());

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setValues({
      ...values,
      [name]: value,
    });

    setModified(true);
  };

  const setDefaultValue = (labelName) => {
    if (defaultOptions[labelName]) {
      if (typeof defaultOptions[labelName] !== "function") {
        return defaultOptions[labelName];
      } else {
        return defaultOptions[labelName]();
      }
    }

    return "";
  };

  return (
    <fieldset className="FormItem">
      {options.map((e, i) => {
        return (
          <React.Fragment>
            {i === 0 && (
              <div className="FormItem-title">
                {modified ? values[`${itemId}_${e}`] : defaultTitle}
              </div>
            )}

            <div className="FormItem-attr">
              <label data-label-name={e}>{e}:</label>
              <input
                value={values[`${itemId}_${e}`]}
                onChange={handleInputChange}
                name={`${itemId}_${e}`}
                label={e}
                defaultValue={setDefaultValue(e)}
                placeholder={e}
                autoComplete={"off"}
              />
            </div>
          </React.Fragment>
        );
      })}

      {subOptions && (
        <div className={`FormItem-suboptions`}>
          {[...Array(totalSubOptions)].map((_, i) => {
            var itemIdSuboption = `${itemId}_sub_${i}`;

            /* Grouping every 3 items into a <div> */
            return subOptions
              .map((each, index) => {
                return (
                  <React.Fragment>
                    <div className="FormItem-suboption-item">
                      <label data-label-name={each}>
                        {each} {i + 1}:
                      </label>

                      <input
                        value={values[`${itemIdSuboption}_${each}`]}
                        onChange={handleInputChange}
                        name={`${itemIdSuboption}_${each}`}
                        label={each}
                        defaultValue={setDefaultValue(each)}
                        placeholder={each}
                        autoComplete={"off"}
                      />
                    </div>

                    {(index % subOptions.length) - 1 === 0 && (
                      <div className="FormItem-suboption-item FormItem-suboption-item--button">
                        <button>+</button>
                      </div>
                    )}
                  </React.Fragment>
                );
              })
              .reduce(function (r, element, _index) {
                _index % 3 === 0 && r.push([]);
                r[r.length - 1].push(element);
                return r;
              }, [])
              .map(function (rowContent) {
                return <div className="FormItem-suboption">{rowContent}</div>;
              });
          })}
        </div>
      )}
    </fieldset>
  );
}
