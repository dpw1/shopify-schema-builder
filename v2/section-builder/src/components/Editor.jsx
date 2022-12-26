import React, { useState, useEffect } from "react";
import { useStatePersist as useStickyState } from "use-state-persist";
import useStore from "../store/store";

import "./Editor.scss";
import Item from "./Item";
import ItemCopy from "./ItemCopy";
import { EditMajor, CancelMajor } from "@shopify/polaris-icons";

export default function Editor(props) {
  const data = props.data;
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
      <button
        data-is-editing={isEditing}
        data-is-editing-id={data.__id}
        className="Editor-edit Preview-edit Preview-icon-button"
        onClick={() => {
          setTimeout(() => {
            setIsEditing(!isEditing);

            if (!isEditing === true) {
              //alert(`enable sortable for ${data.__id}`);
            }
          }, 10);
        }}>
        {isEditing ? <CancelMajor /> : <EditMajor />}
      </button>
      {isEditing && (
        <div className={`Editor-panel  Editor-panel--${data.__id}`}>
          {/* {JSON.stringify(
            Array.from(items).filter((e) => e.__id === data.__id),
          )} */}

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
      )}
    </div>
  );
}
