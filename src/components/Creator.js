import React, { useEffect, useState } from "react";
import short from "short-uuid";
import { sortableContainer, sortableElement } from "react-sortable-hoc";
import arrayMove from "array-move";

import { useForm } from "react-hook-form";

import { useStatePersist as useStickyState } from "use-state-persist";
import Item from "./Item";
import { schema } from "./../utils";

const SortableItem = sortableElement(({ value }) => (
  <React.Fragment>{value}</React.Fragment>
));

const SortableContainer = sortableContainer(({ children }) => {
  return <ul>{children}</ul>;
});

export default function Creator() {
  const { register, handleSubmit, watch, errors } = useForm();

  const [items, setItems] = useStickyState("@items", [
    {
      id: short.generate(),
      type: "link_list",
      content: [],
    },
    {
      id: short.generate(),
      type: "link_list",
      content: [],
    },
  ]);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: short.generate(),
        type: "link_list",
        content: [],
      },
    ]);
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
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setItems(arrayMove(items, oldIndex, newIndex));
  };

  return (
    <div>
      <ul>
        <SortableContainer onSortEnd={onSortEnd}>
          {items.map((props, i) => {
            return (
              <SortableItem
                key={`item-${short.generate()}`}
                index={i}
                value={
                  <Item
                    register={register}
                    schema={schema}
                    handleOnChange={handleOnChange}
                    id={props.id}
                    defaultValue={props.type}
                    name={`name-${i}`}></Item>
                }
              />
            );
          })}
        </SortableContainer>

        <fieldset>
          <button onClick={() => handleAddItem()}>Add</button>
        </fieldset>
      </ul>
    </div>
  );
}
