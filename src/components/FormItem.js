import React, { useState, useEffect } from "react";

import { useStatePersist as useStickyState } from "use-state-persist";
import short from "short-uuid";
import "./FormItem.scss";
import { generateJSONSchema, updateJSONTextarea } from "../utils";

export default function FormItem(props) {
  let { itemId, type, options, defaultOptions } = props;

  if (!defaultOptions) {
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

  return (
    <fieldset className="FormItem">
      {options.map((e) => {
        return (
          <div className="FormItem-attr">
            <label data-label-name={e}>{e}:</label>
            <input
              value={values[`${itemId}_${e}`]}
              onChange={handleInputChange}
              name={`${itemId}_${e}`}
              label={e}
              defaultValue={defaultOptions[e] ? defaultOptions[e] : ""}
              placeholder={e}
              autoComplete={"off"}
            />
          </div>
        );
      })}
    </fieldset>
  );
}
