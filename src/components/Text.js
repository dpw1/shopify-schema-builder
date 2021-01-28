import React, { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { useStatePersist as useStickyState } from "use-state-persist";

export default function Text(props) {
  const { itemId } = props;

  const initialValues = {
    [itemId + "_firstname"]: "",
    [itemId + "_age"]: "",
  };

  const { register, handleSubmit, watch, errors, setValue } = useForm();

  const [items, setItems] = useStickyState("@items");
  const [values, setValues] = useStickyState("@values", initialValues);

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setValues({
      ...values,
      [name]: value,
    });
  };

  useEffect(() => {
    console.log("initial state", initialValues);
  }, []);

  return (
    <fieldset>
      <input
        value={values[itemId + "_ID"]}
        onChange={handleInputChange}
        name={`${itemId}_ID`}
        label="ID"
        placeholder=""
      />
      <input
        value={values[itemId + "_label"]}
        onChange={handleInputChange}
        name={`${itemId}_label`}
        label="label"
      />
    </fieldset>
  );
}
