import React, { useState, useEffect, useRef } from "react";

import { useStatePersist as useStickyState } from "use-state-persist";
import short from "short-uuid";
import "./FormItem.scss";

import Sortable from "sortablejs";
import { Checkbox } from "@shopify/polaris";

import { convertStringToBoolean, transformDOMIntoJSON } from "../utils";
import useStore from "../store/store";
import { generateJSONSchema } from "./../utils";

function FormItem(props) {
  let {
    itemId,
    type,
    options,
    duplicatedOptions,
    duplicatedSubOptions: _duplicatedSubOptions,
    defaultOptions,
    subOptions,
    totalSubOptions: _totalSubOptions,
    itemCount,
  } = props;

  const items = useStore((state) => state.items);

  const [totalSubOptions, setTotalSubOptions] = useState(
    _duplicatedSubOptions ? Object.keys(_duplicatedSubOptions).length : 5,
  );

  const [errors, setErrors] = useState([]);

  const values = useStore((state) => state.values);

  const updateItem = useStore((state) => state.updateItem);

  let duplicatedSubOptions = _duplicatedSubOptions
    ? _duplicatedSubOptions
    : null;

  if (!defaultOptions || defaultOptions.length <= 0) {
    defaultOptions = "";
  }

  if (duplicatedOptions) {
    defaultOptions = duplicatedOptions;
  }

  const handleErrors = (item) => {
    let formErrors = [];

    /* Errors for all inputs 
	========================================= */
    if (item.id === "") {
      formErrors.push({
        id: "id",
        error: "ID can't be empty.",
      });
    }

    if (item.label === "") {
      formErrors.push({
        id: "label",
        error: "Label can't be empty.",
      });
    }

    /* ## Number 
	========================================= */
    if (
      item.type === "number" &&
      item.hasOwnProperty("default") &&
      !Number.isInteger(item.default)
    ) {
      formErrors.push({
        id: "default",
        error: "Default must be a negative or positive number.",
      });
    }

    setErrors(formErrors);

    return formErrors.length;
  };

  /* Ensures that a given input has the correct length, characters, etc. 
  
 Example: numbers can't have characters, only numbers. */
  const handleInputFilter = (item) => {
    let allErrors = 0;

    console.log("my ttt", item.default.toString());
    if (item.default && item.default.toString().includes("a")) {
      alert();

      allErrors += 1;
    }

    return allErrors;
  };

  /* Detects input changes (typing) and update the JSON store's accordingly */
  const handleInputChange = (e) => {
    let $item;

    try {
      $item = e.target.closest(`.item`);
    } catch (err) {
      const $aux = document.querySelector(`#${e}`);
      $item = $aux.closest(`.item`);
    }

    const json = transformDOMIntoJSON($item);

    console.log("updated json (formitem.js): ", json);

    updateItem(json);

    return;
  };

  const setDefaultValue = (labelName) => {
    if (defaultOptions[labelName]) {
      if (type === "checkbox" && labelName === "default") {
        const result = defaultOptions[labelName] === "true" ? true : false;
        console.log(type, labelName, defaultOptions[labelName]);
        return result;
      }

      if (typeof defaultOptions[labelName] !== "function") {
        return defaultOptions[labelName];
      } else {
        return defaultOptions[labelName]();
      }
    }

    return "";
  };

  useEffect(() => {
    var $suboptions = window.document.querySelector(
      `[class*="${itemId}"] .FormItem-sortable-suboptions`,
    );

    if (!$suboptions) {
      return;
    }
    var sortable = Sortable.create($suboptions, {
      onEnd: function (e) {
        setTimeout((_) => {
          const $item = e.item.closest(`.item`);
          updateOnChange($item);
        }, 10);
      },
    });
  }, []);

  function updateOnChange($item = null) {
    if (!$item) {
      throw new Error("no $item passed");
    }

    setTimeout(() => {
      const json = transformDOMIntoJSON($item);

      updateItem(json);
    }, 50);
  }

  return (
    <fieldset className={`FormItem FormItem--${type}`}>
      {options.map((e, i) => {
        const _value = items.filter((x) => x.__id === itemId)[0];
        const value = _value[e];

        function renderInput(value, itemId, type) {
          if (type === "checkbox" && e === "default") {
            return (
              <input
                type="checkbox"
                defaultChecked={convertStringToBoolean(value)}
                onChange={(e) => {
                  handleInputChange(e);
                }}
                name={`${itemId}_${e}`}
                label={e}
                placeholder={e}
                autoComplete={"off"}
              />
            );
          }

          return (
            <input
              value={value}
              onChange={(e) => {
                const $this = e.target;
                const $parent = $this.closest(`.FormItem-attr`);
                const $id = $parent.querySelector(`[data-label-name='id']`);

                if ($id) {
                  if (/\s/.test(e.target.value)) {
                    e.preventDefault();
                    return;
                  }
                }

                handleInputChange(e);
              }}
              name={`${itemId}_${e}`}
              label={e}
              defaultValue={setDefaultValue(e)}
              placeholder={e}
              autoComplete={"off"}
            />
          );
        }

        return (
          <React.Fragment>
            <div key={e + i} className={`FormItem-attr FormItem-attr--${e}`}>
              <label data-label-name={e}>{e}:</label>

              {renderInput(value, itemId, type)}

              <span className="FormItem-error">
                {errors &&
                  errors.filter((x) => x.id === e).length >= 1 &&
                  errors.filter((x) => x.id === e)[0].error}
              </span>
            </div>
          </React.Fragment>
        );
      })}

      {subOptions && (
        <div className={`FormItem-suboptions FormItem-suboptions--${itemId}`}>
          <div className="FormItem-sortable-suboptions">
            {[...Array(totalSubOptions)].map((_, i) => {
              var itemIdSuboption = `${itemId}_suboption_${i}`;

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
                            duplicatedSubOptions && duplicatedSubOptions[i]
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
                .map(function (rowContent, i) {
                  return <div className="FormItem-suboption">{rowContent}</div>;
                });
            })}
          </div>
          <div className="FormItem-suboptions-control">
            <button
              onClick={(e) => {
                setTimeout(() => {
                  const $parent = e.target.closest(`.item`);
                  setTotalSubOptions(totalSubOptions - 1);
                  updateOnChange($parent);
                }, 10);
              }}>
              Remove
            </button>
            <button
              onClick={(e) => {
                setTimeout(() => {
                  const $parent = e.target.closest(`.item`);
                  setTotalSubOptions(totalSubOptions + 1);
                  updateOnChange($parent);
                }, 10);
              }}>
              Add
            </button>
          </div>
        </div>
      )}
    </fieldset>
  );
}

export default FormItem;
