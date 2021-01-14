import React from "react";
import { schema } from "./../utils";

import { useStatePersist as useStickyState } from "use-state-persist";

import "./Item.scss";

export default function Item({
  defaultValue,
  name,
  id,
  handleOnChange,
  register,
  handleDelete,
}) {
  const [items, setItems] = useStickyState("@items");

  return (
    <li className="schema-item">
      <select
        onChange={(e) => handleOnChange(e)}
        defaultValue={defaultValue}
        name={name}
        id={id}
        ref={register}>
        {schema.map(({ id: _id }) => {
          return (
            <option key={_id} value={_id}>
              {_id}
            </option>
          );
        })}
      </select>
      <button
        onClick={() => {
          const updated = [...items].filter((e) => e.id !== id);

          setItems(updated);
        }}
        className="schema-item-delete">
        Delete
      </button>
    </li>
  );
}
