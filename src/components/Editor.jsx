import React, { useState, useEffect } from "react";
import { useStatePersist as useStickyState } from "use-state-persist";
import useStore from "../store/store";

import "./Editor.scss";

import ItemCopy from "./ItemCopy";
import { EditMajor, HideMinor } from "@shopify/polaris-icons";
import { sleep } from "../utils";

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
  const errors = useStore((state) => state.errors);

  useEffect(() => {
    setupTabIndex();
  }, []);

  async function setupTabIndex() {
    await sleep(100);

    const $form = document.querySelector(`.Editor .item`);

    if (!$form) {
      return;
    }

    const $inputs = $form.querySelectorAll(`input[label]`);

    if (!$inputs) {
      return;
    }

    let total = 2;

    for (var [index, each] of $inputs.entries()) {
      each.setAttribute(`tabIndex`, total);
      total += 1;
    }

    console.log($form, $inputs.length, total);
    const $select = document.querySelector(`.Preview-buttons select`);

    $select.setAttribute("tabIndex", total + 1);
  }

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

    updateItems(updated);
  };

  return (
    <div className={`Editor`}>
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
