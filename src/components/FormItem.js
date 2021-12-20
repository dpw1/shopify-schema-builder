import React, { useState, useEffect, useRef } from "react";

import { useStatePersist as useStickyState } from "use-state-persist";
import short from "short-uuid";
import "./FormItem.scss";
import {
  convertToLiquidVariables,
  generateJSONAndVariables,
  sleep,
  updateJSONDOM,
  updateLiquidVariablesDOM,
} from "../utils";
import useStore from "../store/store";
import { generateJSONSchema } from "./../utils";

export default function FormItem(props) {
  const [modified, setModified] = useState(false);
  const variables = useStore((state) => state.variables);

  const values = useStore((state) => state.values);
  const addValues = useStore((state) => state.addValues);

  let {
    itemId,
    type,
    options,
    duplicatedOptions,
    duplicatedSubOptions,
    defaultOptions,
    subOptions,
    totalSubOptions,
    itemCount,
  } = props;

  // generateJSONAndVariables();

  if (duplicatedSubOptions && duplicatedSubOptions.length > 5) {
    totalSubOptions = duplicatedSubOptions.length;
  }

  if (!defaultOptions || defaultOptions.length <= 0) {
    defaultOptions = "";
  }

  if (duplicatedOptions) {
    defaultOptions = duplicatedOptions;
  }

  const initialValues = () => {
    let data = {};

    options.map((e) => {
      const str = `${itemId}_${e}`;

      return (data[str] = "");
    });

    return data;
  };

  // const [values, setValues] = useStickyState("@values", initialValues());

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    addValues({
      ...values,
      [name]: value,
    });

    console.log("input change");

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

  const setItemsTitle = () => {
    const characters = values[`${itemId}_id`] && values[`${itemId}_id`].length;

    console.log("charac", characters);

    if (!characters || characters <= 0) {
      if (modified) {
        return "";
      }

      return setDefaultValue("id");
    }
    return values[`${itemId}_id`] || setDefaultValue("id");
  };

  const forceInputInitiation = async () => {
    await sleep(50);

    const $elements = document.querySelectorAll(`.FormItem input`);

    for (var each of $elements) {
      const name = each.name;
      const value = each.value;

      console.log(`ec, [${name}]: ${value}`);
      addValues({
        [name]: value,
      });
    }
  };

  const updateJSONAndVariables = () => {
    console.log("look at me values", values);

    const json = generateJSONSchema();
    const variables = convertToLiquidVariables(json);

    updateJSONDOM(json);
    updateLiquidVariablesDOM(variables);
  };

  useEffect(() => {
    forceInputInitiation();
  }, []);

  useEffect(() => {
    updateJSONAndVariables();
  }, [values]);

  return (
    <fieldset className="FormItem">
      {options.map((e, i) => {
        return (
          <React.Fragment>
            {i === 0 && <div className="FormItem-title">{setItemsTitle()}</div>}

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

            /* Grouping every 3 items into a <div>.
            This is where the "select" and "radio" items are rendered. */
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
                        defaultValue={
                          duplicatedSubOptions.length >= 1
                            ? duplicatedSubOptions[i][each]
                            : ""
                        }
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
