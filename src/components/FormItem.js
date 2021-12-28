import React, { useState, useEffect, useRef } from "react";

import { useStatePersist as useStickyState } from "use-state-persist";
import short from "short-uuid";
import "./FormItem.scss";
import { getJsonResult, setJsonResult, updateJSONAndVariables } from "../utils";
import useStore from "../store/store";
import { generateJSONSchema } from "./../utils";

export default function FormItem(props) {
  const [modified, setModified] = useState(false);

  const values = useStore((state) => state.values);

  const addValues = useStore((state) => state.addValues);

  let {
    itemId,
    type,
    options,
    duplicatedOptions,
    duplicatedSubOptions: _duplicatedSubOptions,
    defaultOptions,
    subOptions,
    totalSubOptions,
    itemCount,
  } = props;

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

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    addValues({
      ...values,
      [name]: value,
    });

    const json = generateJSONSchema();

    setJsonResult(json);
    setModified(true);

    const prev = getJsonResult();
    console.log(
      "xxx",
      prev.previous.map((e) => e.id),
    );
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
    console.log("look at me values", values);
  }, [values]);

  // useEffect(() => {
  //   console.log("last updated", lastChanfgedInput);
  // }, [lastChangedInput]);

  const useFocus = () => {
    const htmlElRef = useRef(null);
    const setFocus = () => {
      htmlElRef.current && htmlElRef.current.focus();
    };

    return [htmlElRef, setFocus];
  };

  const [inputRef, setInputFocus] = useFocus();

  return (
    <fieldset className="FormItem">
      {options.map((e, i) => {
        return (
          <React.Fragment>
            {i === 0 && <div className="FormItem-title">{setItemsTitle()}</div>}

            <div className="FormItem-attr">
              <label data-label-name={e}>{e}:</label>
              <input
                ref={inputRef}
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

                      <p>
                        {console.log(
                          "shit",
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
              .map(function (rowContent) {
                return <div className="FormItem-suboption">{rowContent}</div>;
              });
          })}
        </div>
      )}
    </fieldset>
  );
}
