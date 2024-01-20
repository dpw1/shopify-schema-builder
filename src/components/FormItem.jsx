import React, { useState, useEffect, useRef } from "react";

import { useStatePersist as useStickyState } from "use-state-persist";
import short from "short-uuid";
import "./FormItem.scss";

import Sortable from "sortablejs";
import { Checkbox } from "@shopify/polaris";

import {
  convertStringToBoolean,
  handleInputChange,
  transformDOMIntoJSON,
} from "../utils";
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
    extraOptions,
    itemCount,
  } = props;

  const items = useStore((state) => state.items);
  const errors = useStore((state) => state.errors);
  const setErrors = useStore((state) => state.setErrors);
  const removeError = useStore((state) => state.removeError);
  const resetErrors = useStore((state) => state.resetErrors);

  const [hasFocusedOnId, setHasFocusedOnId] = useState(false);
  const [hasIdChanged, setHasIdChanged] = useState(false);

  const [totalSubOptions, setTotalSubOptions] = useState(
    _duplicatedSubOptions ? Object.keys(_duplicatedSubOptions).length : 5,
  );

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
    /* Errors for all inputs 
	========================================= */

    let hasError = false;
    let inputs = [];

    const $form = document.querySelector(`.Editor [data-item-id='${item.id}']`);

    if (!$form) {
      return;
    }

    const $inputs = $form.querySelectorAll(`.FormItem-attr input[label]`);

    if (!$inputs) {
      return;
    }

    for (var each of $inputs) {
      const label = each.getAttribute(`label`);
      const value = each.value;

      inputs.push({ label, value });
    }

    const { label, id } = inputs.reduce((a, b) => {
      a[b.label] = b;
      return a;
    }, {});

    if (id) {
      if (id.value === "") {
        hasError = true;
        setErrors({
          label: "id",
          id: itemId,
          message: "ID can't be empty",
        });
      } else {
        removeError({ id: itemId, label: "id" });
      }
    }

    if (label) {
      if (label.value === "") {
        hasError = true;
        setErrors({
          label: "label",
          id: itemId,
          message: "Label can't be empty",
        });
      } else {
        removeError({ id: itemId, label: "label" });
      }
    }

    if (!hasError) {
      // reset errors
      // resetErrors();
    }

    /* ## Number 
	========================================= */
    // if (
    //   item.type === "number" &&
    //   item.hasOwnProperty("default") &&
    //   !Number.isInteger(item.default)
    // ) {
    //   formErrors.push({
    //     id: "default",
    //     error: "Default must be a negative or positive number.",
    //   });
    // }
  };

  /* Ensures that a given input has the correct length, characters, etc. 
  
 Example: numbers can't have characters, only numbers. */
  const handleInputFilter = (item) => {
    let allErrors = 0;

    if (item.default && item.default.toString().includes("a")) {
      allErrors += 1;
    }

    return allErrors;
  };

  const setDefaultValue = (labelName) => {
    if (defaultOptions[labelName]) {
      if (type === "checkbox" && labelName === "default") {
        const result = defaultOptions[labelName] === "true" ? true : false;
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

  useEffect(() => {
    console.log("my errors", errors);
  }, [errors]);

  function updateOnChange($item = null) {
    if (!$item) {
      throw new Error("no $item passed");
    }

    setTimeout(() => {
      const json = transformDOMIntoJSON($item);

      updateItem(json);
    }, 50);
  }

  function renderErrorMessage(id, _label) {
    const found =
      errors &&
      errors.length >= 1 &&
      errors.filter((e) => e.id === id).length >= 1
        ? errors.filter((e) => e.id === id)
        : false;

    if (!found || (found && found.length <= 0)) {
      return <span className="FormItem-error"> </span>;
    }

    for (var each of found) {
      if (each.label === _label) {
        return <span className="FormItem-error">{each.message}</span>;
      }
    }

    return <span className="FormItem-error"> </span>;
  }

  function handleRealtimeError(event, label, id) {
    if (label === "id") {
      setHasIdChanged(true);
      if (/\s/.test(event.target.value)) {
        event.preventDefault();
        return;
      }
    }

    if (label === "label" && hasIdChanged === false) {
      const $id = document.querySelector(`input[name='${id}_id']`);

      $id.value = event.target.value
        .replace(/\s/g, "_")
        .replace(/[^a-zA-Z0-9-_]/g, "")
        .toLowerCase()
        .trim();
    }

    if (label === "injectVariableInHTML" && event.target.value.trim() === "") {
      removeError({
        id,
        label,
      });
    }
  }

  return (
    <fieldset key={itemId} className={`FormItem FormItem--${type}`}>
      {options.map((e, i) => {
        let _value, value;

        _value = items.filter((x) => x.__id === itemId)[0];

        if (!_value) {
          return;
        }
        value = _value[e];

        function renderInput(value, _id, type) {
          if (type === "checkbox" && e === "default") {
            return (
              <input
                type="checkbox"
                defaultChecked={convertStringToBoolean(value)}
                onChange={(e) => {
                  handleInputChange(e, updateItem);
                }}
                name={`${_id}_${e}`}
                label={e}
                placeholder={e}
                autoComplete={"off"}
              />
            );
          }

          return (
            <>
              <input
                className={
                  errors &&
                  errors.length >= 1 &&
                  errors.filter((x) => x.id === itemId && x.label === e)
                    .length >= 1
                    ? "FormItem-input--error"
                    : ""
                }
                value={value}
                onChange={(event) => {
                  console.log("items - typing", event.target.value);

                  handleErrors({
                    value: event.target.value,
                    label: e,
                    id: itemId,
                  });

                  handleRealtimeError(event, e, itemId);
                  handleInputChange(event, updateItem);
                }}
                name={`${_id}_${e}`}
                label={e}
                defaultValue={setDefaultValue(e)}
                placeholder={e}
                autoComplete={"off"}
              />
              {renderErrorMessage(_id, e)}
            </>
          );
        }

        const label = e === "injectVariableInHTML" ? "Inject in HTML" : e;
        return (
          <React.Fragment>
            <div key={e + i} className={`FormItem-attr FormItem-attr--${e}`}>
              <label data-label-name={e}>{label}:</label>

              {renderInput(value, itemId, type)}
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
                          onChange={(e) => {
                            handleInputChange(e, updateItem);
                          }}
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
                  return (
                    <div key={i} className="FormItem-suboption">
                      {rowContent}
                    </div>
                  );
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
      {extraOptions && extraOptions.length >= 1 && (
        <>
          <div className="FormItem--advanced">
            <b>Advanced</b>
            {extraOptions.map((e, i) => {
              let _value, value;
              const placeholder =
                e === "injectVariableInHTML" ? ".my-element" : e;

              _value = items.filter((x) => x.__id === itemId)[0];

              if (!_value) {
                return;
              }
              value = _value[e];

              function renderInput(value, _id, type) {
                return (
                  <>
                    <input
                      className={
                        errors &&
                        errors.length >= 1 &&
                        errors.filter((x) => x.id === itemId && x.label === e)
                          .length >= 1
                          ? "FormItem-input--error"
                          : ""
                      }
                      value={value}
                      onChange={(event) => {
                        handleRealtimeError(event, e, itemId);
                        handleInputChange(event, updateItem);
                      }}
                      name={`${_id}_${e}`}
                      label={e}
                      defaultValue={setDefaultValue(e)}
                      placeholder={placeholder}
                      autoComplete={"off"}
                    />
                    {renderErrorMessage(_id, e)}
                  </>
                );
              }

              const label = e === "injectVariableInHTML" ? "Inject in HTML" : e;
              return (
                <React.Fragment>
                  <div
                    key={e + i}
                    className={`FormItem-attr FormItem-attr--${e}`}>
                    <label data-label-name={e}>{label}:</label>

                    {renderInput(value, itemId, type)}
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </>
      )}
    </fieldset>
  );
}

export default FormItem;
