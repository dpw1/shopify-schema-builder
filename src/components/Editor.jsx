import React, { useState, useEffect } from "react";
import { useStatePersist as useStickyState } from "use-state-persist";
import useStore from "../store/store";

import "./Editor.scss";

import ItemCopy from "./ItemCopy";
import { EditMajor, HideMinor } from "@shopify/polaris-icons";

export default function Editor({ props: _props }) {
  const props = JSON.parse(_props);
  const data = JSON.parse(_props).props;

  const [isEditing, setIsEditing] = useStickyState(`@${data.__id}`, false);
  const items = useStore((state) => state.items);

  const updateItems = useStore((state) => state.updateItems);

  const removeItem = useStore((state) => state.removeItem);

  const handleDeleteItem = (id) => {
    removeItem(id);
  };

  const handleOnChange = (e) => {
    const { value: type } = e.target;

    const id = e.target.getAttribute("id");

    let updated = [
      ...items.map((e) => {
        if (e.__id === id) {
          e.type = type;
        }

        return e;
      }),
    ];

    console.log("updated: ", updated);

    updateItems(updated);
  };

  useEffect(() => {
    // console.log("EDITOR.JSX -- items", items)
  }, [items]);

  return (
    <div className="Editor">
      <div className={`Editor-panel  Editor-panel--${data.__id}`}>
        <ItemCopy
          isEditing={isEditing}
          handleDeleteItem={handleDeleteItem}
          defaultValue={data.type}
          id={data.__id}
          type={data.type}
          defaultOptions={{ ...data }}
          itemCount={data.itemCount}
          duplicatedSubOptions={data.options}
          handleOnChange={handleOnChange}></ItemCopy>
        <h1>{props.itemCount}</h1>
      </div>
    </div>
  );
}
