import React, { useEffect, useState } from "react";
import short from "short-uuid";
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import arrayMove from "array-move";
import { useStatePersist as useStickyState } from "use-state-persist";

import { useForm } from "react-hook-form";

import "./Creator.scss";
import {
  schema,
  updateJSONDOM,
  generateJSONSchema,
  focusDropdown,
  sleep,
  convertToLiquidVariables,
  generateJSONAndVariables,
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
  const [lastChangedInput, setLastChangedInput] = useStickyState(
    "@lastChangedInput",
    [],
  );

  const items = useStore((state) => state.items);
  // const values = useStore((state) => state.values);

  const addItems = useStore((state) => state.addItems);
  const addItem = useStore((state) => state.addItem);
  const updateItems = useStore((state) => state.updateItems);

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
          {
            label: "550px",
            value: "550px",
          },
          {
            label: "650px",
            value: "650px",
          },
          {
            label: "750px",
            value: "750px",
          },
          {
            label: "Full screen",
            value: "100vh",
          },
        ],
      },
      {
        type: "select",
        id: "section_height_mobile",
        label: "Mobile height",
        default: "auto",
        options: [
          {
            label: "Auto",
            value: "auto",
          },
          {
            label: "250px",
            value: "250px",
          },
          {
            label: "300px",
            value: "300px",
          },
          {
            label: "400px",
            value: "400px",
          },
          {
            label: "500px",
            value: "500px",
          },
          {
            label: "Full screen",
            value: "100vh",
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
      {
        type: "checkbox",
        id: "full_width_images_mobile",
        label: "Full width images (mobile)",
        info: 'Images that won\'t cut off. This will overwrite the "Mobile height". Recommended size: 800 x 800px',
        default: false,
      },
      {
        type: "checkbox",
        id: "parallax",
        label: "Enable parallax",
        info: 'Parallax may zoom in some images, making them look "cut off".',
        default: false,
      },
    ];

    const op = convertSchemaJSONToItems(test);
    addItems(op);
  };

  const handleDeleteItem = (id) => {
    const updated = [...items].filter((e) => e.id !== id);

    updateItems(updated);
    handleUpdateTextarea();
    generateJSONAndVariables();

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
    generateJSONAndVariables();
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

    generateJSONAndVariables();
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
        <button id="toggleAll" onClick={handleToggleAll}>
          Toggle all
        </button>
      </div>

      <SortableContainer useDragHandle onSortEnd={onSortEnd}>
        {items.map((props, i) => {
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
        <button className="Creator-add" onClick={() => handleAddItem()}>
          Add
        </button>
        <button
          className="Creator-test"
          onClick={async () => {
            addCustomItem();
          }}>
          Test
        </button>
        <button
          id="generateJSON"
          onClick={async () => {
            generateJSON();
          }}>
          Generate JSON
        </button>
      </fieldset>
    </div>
  );
}
