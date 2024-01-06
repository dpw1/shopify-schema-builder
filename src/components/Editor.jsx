import React, { useState, useEffect } from "react";
import { useStatePersist as useStickyState } from "use-state-persist";
import useStore from "../store/store";

import "./Editor.scss";

import ItemCopy from "./ItemCopy";
import { EditMajor, HideMinor } from "@shopify/polaris-icons";

window.isEventListenerAdded = false;

export default function Editor({ props: _props }) {
  const props = JSON.parse(_props);
  const data = JSON.parse(_props).props;

  const selectedItems = useStore((state) => state.selectedItems);

  const [isEditing, setIsEditing] = useStickyState(`@${data.__id}`, false);
  const [isDuplicating, setIsDuplicating] = useState(false);
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

  function duplicate() {
    const $button = document.querySelector(
      `.Editor [data-item-count] .item-duplicate`,
    );

    if (!$button) {
      return;
    }

    console.log("duplicate: ", $button);

    $button.click();
  }

  function addKeyListener() {
    function handleKeyDown(event) {
      if (event.ctrlKey && event.key === "d") {
        event.preventDefault();
        console.log("dup");
        duplicate();
      }
    }

    // Function to add the event listener
    function addEventListenerOnce() {
      if (!isEventListenerAdded) {
        document.addEventListener("keydown", handleKeyDown);
        isEventListenerAdded = true;
      }
    }

    // Call the function to add the event listener
    addEventListenerOnce();
  }

  useEffect(() => {
    addKeyListener();
  }, []);

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
