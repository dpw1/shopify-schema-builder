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
  focusDropdown,
  sleep,
  convertToLiquidVariables,
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

  const [variablesResult, setVariablesResult] = useStickyState(
    "@variablesResult",
    null,
  );

  const [jsonResult, setJsonResult] = useStickyState("@jsonResult");
  const [items, setItems] = useStickyState("@items", [
    {
      id: short.generate(),
      type: "header",
      data: undefined,
      isToggled: false,
    },
  ]);

  const handleUpdateTextarea = async () => {
    await sleep(50);
    const json = generateJSONSchema();
    updateJSONTextarea(json);
    setJsonResult(json);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: short.generate(),
        type: "text",
      },
    ]);

    handleUpdateTextarea();
    focusDropdown();
    setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 50);
  };

  const handleDeleteItem = (id) => {
    ConfirmDialog({
      title: "Delete",
      message: "Are you sure you'd like to delete this?",
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

    const num = e.target.closest(`.item`).getAttribute("data-item-count");
    focusFirstInputWhenDropdownChanges(num);
  };

  const focusFirstInputWhenDropdownChanges = (num) => {
    setTimeout(() => {
      const $el = document.querySelector(
        `[data-item-count*='${num}'] .FormItem-attr:nth-child(1) input`,
      );

      if (!$el) {
        return;
      }

      $el.focus();
    }, 50);
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setItems(arrayMove(items, oldIndex, newIndex));

    handleUpdateTextarea();
  };

  const handleToggle = (e, id) => {
    console.log(id);
    // const $parent = e.target.closest(".item");

    // $parent.classList.toggle("item--toggle");

    let updated = [
      ...items.map((e) => {
        if (e.id === id) {
          e.isToggled = !e.isToggled;
        }

        return e;
      }),
    ];

    setItems(updated);
  };

  useEffect(() => {
    console.log("xxx", items);
  }, [items]);

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
                  isToggled={props.isToggled}
                  Content={props.content}
                  register={register}
                  schema={schema}
                  handleOnChange={handleOnChange}
                  id={props.id}
                  type={props.type}
                  handleToggle={handleToggle}
                  handleDeleteItem={handleDeleteItem}
                  itemCount={`${i + 1}`}
                  defaultValue={props.type}
                  name={`name-${i}`}></Item>
              }
            />
          );
        })}
      </SortableContainer>

      <fieldset>
        <button onClick={() => handleAddItem()}>Add</button>
        <button
          id="generateJSON"
          onClick={() => {
            const variables = convertToLiquidVariables(jsonResult);
            setVariablesResult(variables);
            handleUpdateTextarea();
          }}>
          Generate JSON
        </button>
      </fieldset>
    </div>
  );
}
