import React, { useEffect, useState } from "react";
import ViewportList from "react-viewport-list";

import short from "short-uuid";
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import arrayMove from "array-move";
import { useStatePersist as useStickyState } from "use-state-persist";
import { Button, RangeSlider, TextField } from "@shopify/polaris";

import { useForm } from "react-hook-form";

import "./Creator.scss";
import {
  schema,
  updateJSONDOM,
  generateJSONSchema,
  focusDropdown,
  sleep,
  convertToLiquidVariables,
  updateJSONAndVariables,
  convertSchemaJSONToItems,
  getJsonResult,
} from "./../utils";

import ConfirmDialog from "./ConfirmDialog";
import Item from "./Item";
import useStore from "../store/store";

const SortableItem = sortableElement(({ value }) => (
  <React.Fragment>{value}</React.Fragment>
));

const SortableContainer = sortableContainer(({ children }) => {
  return <ul>{children}</ul>;
});

export default function Creator() {
  const { register, setValue, handleSubmit, watch, errors } = useForm();
  const [isToggled, setIsToggled] = useStickyState(false);

  const items = useStore((state) => state.items);
  const addItems = useStore((state) => state.addItems);
  const addItem = useStore((state) => state.addItem);
  const updateItems = useStore((state) => state.updateItems);

  const [visibleItems, setVisibleItems] = useStickyState("@visibleItems", []);

  const jsonResult = useStore((state) => state.jsonResult);
  const setGlobalJson = useStore((state) => state.setGlobalJson);

  const updateVariablesResult = useStore(
    (state) => state.updateVariablesResult,
  );

  const handleUpdateTextarea = async () => {
    await sleep(10);
    const json = generateJSONSchema();
    updateJSONDOM(json);
  };

  useEffect(() => {
    console.log("my items", items);

    let ids = [];
    var $editing = document.querySelectorAll(`[data-is-editing='true']`);

    for (var each of $editing) {
      ids.push(each.getAttribute("data-is-editing-id"));
    }

    var updated = Array.from(items).filter((e) => ids.includes(e.id));

    setVisibleItems(updated);
  }, [items]);

  const handleAddItem = async () => {
    /* All available par<<ameters can be found as the props for FormItem.js */

    const id = short.generate();

    addItem(
      ...[
        {
          id,
          type: "text",
        },
      ],
    );

    setTimeout(() => {
      const json = generateJSONSchema();
      setGlobalJson(json);
    }, 50);
  };

  useEffect(() => {
    console.log("my visib", visibleItems);
  }, [visibleItems]);

  const addCustomItem = async () => {
    var test = [
      {
        type: "select",
        id: "section_height",
        label: "Desktop height",
        default: "650px",
        options: [
          {
            label: "Auto",
            value: "natural",
          },
          {
            label: "450px",
            value: "450px",
          },
        ],
      },

      {
        type: "checkbox",
        id: "full_width_images",
        label: "Full width images",
        info: 'Images that won\'t cut off. This will overwrite the "Desktop height". Recommended size: 1440 x 810px',
        default: false,
      },
    ];

    const op = convertSchemaJSONToItems(test);

    console.log("result", op);
    // return;
    addItems(op);
  };

  const handleDeleteItem = (id) => {
    const updated = [...items].filter((e) => e.id !== id);

    updateItems(updated);
    handleUpdateTextarea();

    setTimeout(() => {
      const json = generateJSONSchema();
      setGlobalJson(json);
    }, 50);
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

    updateItems(updated);

    handleUpdateTextarea();

    const num = e.target.closest(`.item`).getAttribute("data-item-count");
    focusFirstInputWhenDropdownChanges(num);
    setTimeout(() => {
      const json = generateJSONSchema();
      setGlobalJson(json);
    }, 50);
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

  const onSortEnd = async ({ oldIndex, newIndex }) => {
    const ordered = arrayMove(items, oldIndex, newIndex);

    updateItems(ordered);

    updateJSONAndVariables();

    setTimeout(() => {
      const json = generateJSONSchema();
      setGlobalJson(json);
    }, 50);
  };

  const handleToggle = (e, id) => {
    let updated = [
      ...items.map((e) => {
        if (e.id === id) {
          e.isToggled = !e.isToggled;
        }

        return e;
      }),
    ];

    updateItems(updated);
  };

  const handleToggleAll = () => {
    let updated = [
      ...items.map((e) => {
        e.isToggled = isToggled;

        return e;
      }),
    ];

    setIsToggled(!isToggled);

    updateItems(updated);
  };

  /* This function is responsible for generating the JSON and Liquid. 
  Its only purpose is to make the function "generateJSONAndVariables" from utils.js to work. */
  const generateJSON = async () => {
    handleUpdateTextarea();

    const variables = convertToLiquidVariables(jsonResult);

    await sleep(50);
    updateVariablesResult(variables);
  };

  return (
    <div className="Creator">
      <div className="Creator-controls">
        {/* <button id="toggleAll" onClick={handleToggleAll}>
          Toggle all
        </button> */}
      </div>

      <SortableContainer useDragHandle onSortEnd={onSortEnd}>
        {Array.from(items)
          .filter((x) => x.id === "hRtJKPrK9eUG9DLgTUEHzh")
          .map((props, i) => {
            return (
              <React.Fragment>
                <SortableItem
                  key={`item-${short.generate()}`}
                  index={i}
                  value={
                    <Item
                      duplicatedOptions={props.duplicatedOptions}
                      duplicatedSubOptions={props.duplicatedSubOptions}
                      isToggled={props.isToggled}
                      Content={props.content}
                      register={register}
                      setValue={setValue}
                      schema={schema}
                      handleOnChange={handleOnChange}
                      id={props.id}
                      type={props.type}
                      handleToggle={handleToggle}
                      handleDeleteItem={handleDeleteItem}
                      itemCount={`${i + 1}`}
                      defaultValue={props.type}
                      name={`name-${i}`}
                      sortableHandle={sortableHandle}></Item>
                  }
                />
              </React.Fragment>
            );
          })}
      </SortableContainer>

      <fieldset>
        <Button className="Creator-add" onClick={() => handleAddItem()}>
          Add
        </Button>
        <Button
          className="Creator-test"
          onClick={async () => {
            addCustomItem();
          }}>
          Test
        </Button>
        {/* <Button
          id="generateJSON"
          onClick={async () => {
            generateJSON();
          }}>
          Generate JSON
        </Button> */}
      </fieldset>
    </div>
  );
}
