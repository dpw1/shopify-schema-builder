import React, { useState, useEffect } from "react";

import { useStatePersist as useStickyState } from "use-state-persist";
import short from "short-uuid";
import "./FormItem.scss";
import { generateJSONSchema, updateJSONTextarea } from "../utils";

export default function FormItem(props) {
  let { itemId, type, options, defaultOptions, itemCount } = props;

  console.log("look: ", defaultOptions);
  if (!defaultOptions || defaultOptions.length <= 0) {
    console.log("removing!");
    defaultOptions = "";
  }

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
        );
      })}
    </fieldset>
  );
}
