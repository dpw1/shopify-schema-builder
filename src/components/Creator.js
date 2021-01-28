import React, { useEffect, useState } from "react";
import short from "short-uuid";
import { sortableContainer, sortableElement } from "react-sortable-hoc";
import arrayMove from "array-move";

import { useForm } from "react-hook-form";

import { useStatePersist as useStickyState } from "use-state-persist";

import "./Creator.scss";
import {
  schema,
  updateJSONTextarea,
  generateJSONSchema,
  sleep,
} from "./../utils";

import ConfirmDialog from "./ConfirmDialog";
import Item from "./Item";

const SortableItem = sortableElement(({ value }) => (
  <React.Fragment>{value}</React.Fragment>
));

const SortableContainer = sortableContainer(({ children }) => {
  return <ul>{children}</ul>;
});

export default function Creator() {
  const { register, handleSubmit, watch, errors } = useForm();

  const [jsonResult, setJsonResult] = useStickyState("@jsonResult");
  const [items, setItems] = useStickyState("@items", [
    {
      id: short.generate(),
      type: "header",
      data: undefined,
    },
  ]);

  const handleUpdateTextarea = async () => {
    sleep(50);
    const json = generateJSONSchema();
    updateJSONTextarea(json);
    setJsonResult(json);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: short.generate(),
        type: "header",
        data: {},
      },
    ]);

    handleUpdateTextarea();
  };

  const handleDeleteItem = (id) => {
    ConfirmDialog({
      title: "Delete?",
      confirm: () => {
        const updated = [...items].filter((e) => e.id !== id);

        setItems(updated);

        return handleUpdateTextarea();
      },
      deny: () => {
        return;
      },
    });
  };

  const handleOnChange = (e) => {
    const { value: type } = e.target;

    const id = e.target.getAttribute("id");

    let updated = [
      ...items.map((e) => {
        if (e.id === id) {
          e.type = type;
        }

        return e;
      }),
    ];

    setItems(updated);

    handleUpdateTextarea();
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setItems(arrayMove(items, oldIndex, newIndex));

    handleUpdateTextarea();
  };

  return (
    <div className="Creator">
      <SortableContainer onSortEnd={onSortEnd}>
        {items.map((props, i) => {
          return (
            <SortableItem
              key={`item-${short.generate()}`}
              index={i}
              value={
                <Item
                  Content={props.content}
                  register={register}
                  schema={schema}
                  handleOnChange={handleOnChange}
                  id={props.id}
                  type={props.type}
                  handleDeleteItem={handleDeleteItem}
                  defaultValue={props.type}
                  name={`name-${i}`}></Item>
              }
            />
          );
        })}
      </SortableContainer>

      <fieldset>
        <button onClick={() => handleAddItem()}>Add</button>
        <button onClick={() => handleUpdateTextarea()}>Generate JSON</button>
      </fieldset>
    </div>
  );
}
