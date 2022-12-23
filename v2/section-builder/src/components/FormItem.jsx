import React, { FC, useState, useEffect, useRef } from "react";

import { useStatePersist as useStickyState } from "use-state-persist";
import short from "short-uuid";
import "./FormItem.scss";

import Sortable from "sortablejs";

import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from "react-sortable-hoc";

import {
  getJsonResult,
  setJsonResult,
  updateJSONAndVariables,
  updateSectionSettings,
} from "../utils";
import useStore from "../store/store";
import { generateJSONSchema } from "./../utils";

export default function FormItem(props) {
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

  const [list, setList] = useState(subOptions ? subOptions : []);

  const [modified, setModified] = useState(false);
  const [errors, setErrors] = useState([]);
  const [totalSubOptions, setTotalSubOptions] = useStickyState(
    `totalSubOptios-${itemId}`,
    _totalSubOptions,
  );

  const values = useStore((state) => state.values);

  const addValues = useStore((state) => state.addValues);
  const setGlobalJson = useStore((state) => state.setGlobalJson);

  let duplicatedSubOptions = _duplicatedSubOptions
    ? _duplicatedSubOptions
    : null;

  if (duplicatedSubOptions && duplicatedSubOptions.length > 5) {
    totalSubOptions = duplicatedSubOptions.length;
  }

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

  const handleInputChange = (e) => {
    setErrors([]);

    const name = e.target.name;
    const value = e.target.value;

    const __id = name.split("_")[0];

    const json = generateJSONSchema();

    setJsonResult(json);
    setGlobalJson(json);
    setModified(true);

    const modifiedItem = JSON.parse(json).filter((e) => e.__id === __id)[0];

    if (handleErrors(modifiedItem).length >= 1) {
      return;
    }

    if (modifiedItem.hasOwnProperty("id")) {
      updateSectionSettings(__id, modifiedItem.id);
    }

    addValues({
      ...values,
      [name]: value,
    });
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

  const filterValue = (text) => {
    if (!text) {
      return "error";
    }

    return text;
  };

  const setItemsTitle = () => {
    const characters = values[`${itemId}_id`] && values[`${itemId}_id`].length;

    if (!characters || characters <= 0) {
      if (modified) {
        return "";
      }

      return setDefaultValue("id");
    }
    return values[`${itemId}_id`] || setDefaultValue("id");
  };

  useEffect(() => {
    updateJSONAndVariables();
    //console.log("look at me values", values);
  }, [values]);

  useEffect(() => {
    var $suboptions = window.document.querySelectorAll(
      ".FormItem-sortable-suboptions",
    );

    if (!$suboptions) {
      return;
    }

    for (var each of $suboptions) {
      var sortable = Sortable.create(each, {
        onEnd: function () {
          updateOnChange();
        },
      });
    }
  }, []);

  const useFocus = () => {
    const htmlElRef = useRef(null);
    const setFocus = () => {
      htmlElRef.current && htmlElRef.current.focus();
    };

    return [htmlElRef, setFocus];
  };

  function updateOnChange() {
    setTimeout((_) => {
      const json = generateJSONSchema();

      setJsonResult(json);
      setGlobalJson(json);
      setModified(true);
    }, 50);
  }

  return (
    <fieldset className="FormItem">
      {options.map((e, i) => {
        return (
          <React.Fragment>
            <div className="FormItem-attr">
              <label data-label-name={e}>{e}:</label>
              <input
                value={values[`${itemId}_${e}`]}
                onChange={(e) => {
                  handleInputChange(e);
                }}
                name={`${itemId}_${e}`}
                label={e}
                defaultValue={setDefaultValue(e)}
                placeholder={e}
                autoComplete={"off"}
              />

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
        <div className={`FormItem-suboptions`}>
          <div className="FormItem-sortable-suboptions">
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

                        <p>
                          {console.log(
                            "moving!",
                            duplicatedSubOptions && duplicatedSubOptions[i]
                              ? duplicatedSubOptions[i][each]
                              : "",
                          )}
                        </p>
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
              onClick={() => {
                setTotalSubOptions(totalSubOptions - 1);
                updateOnChange();
              }}>
              Remove
            </button>
            <button
              onClick={() => {
                setTotalSubOptions(totalSubOptions + 1);

                updateOnChange();
              }}>
              Add
            </button>
          </div>
        </div>
      )}
    </fieldset>
  );
}
