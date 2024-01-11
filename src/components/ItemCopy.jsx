import React, { useState, useEffect, useRef } from "react";

import { useStatePersist as useStickyState } from "use-state-persist";

import {
  addToIndex,
  schema,
  sleep,
  transformDOMIntoJSON,
  resetJsonResult,
  generateJSONSchema,
  setJsonResult,
  scrollToItem,
  addObjectToIndex,
} from "../utils";

import short from "short-uuid";
import "./Item.scss";

import Text from "./Text";
import FormItem from "./FormItem";

import useStore from "../store/store";
import { Select } from "@shopify/polaris";
import create from "zustand";

import { subscribeWithSelector } from "zustand/middleware";

const renderElement = (
  type,
  itemId,
  itemCount,
  _duplicatedOptions,
  duplicatedSubOptions,
  defaultOptions,
) => {
  /* 
Options = editable elements. (id, label, info, etc)
*/
  const duplicatedOptions = _duplicatedOptions
    ? _duplicatedOptions
    : defaultOptions;

  switch (type) {
    case "header":
      return (
        <FormItem
          itemCount={itemCount}
          options={["content"]}
          type={"header"}
          itemId={itemId}
          duplicatedOptions={duplicatedOptions}
          defaultOptions={{
            content: "Options",
          }}
        />
      );
    case "paragraph":
      return (
        <FormItem
          itemCount={itemCount}
          options={["content"]}
          type={"paragraph"}
          duplicatedOptions={duplicatedOptions}
          defaultOptions={defaultOptions}
          itemId={itemId}
        />
      );
    case "text":
      return (
        <>
          <FormItem
            itemCount={itemCount}
            options={["id", "label", "info", "placeholder", "default"]}
            extraOptions={["injectVariableInHTML"]}
            type="text"
            duplicatedOptions={duplicatedOptions}
            defaultOptions={{
              ...defaultOptions,
              id: `text_${itemCount}`,
              label: `Text ${itemCount}`,
            }}
            itemId={itemId}
          />
        </>
      );
    case "color":
      return (
        <FormItem
          itemCount={itemCount}
          options={["id", "label", "info", "default"]}
          type="color"
          duplicatedOptions={duplicatedOptions}
          itemId={itemId}
          defaultOptions={{
            default: "#ffffff",
            id: `color_${itemCount}`,
            label: `Color ${itemCount}`,
          }}
        />
      );
    case "font_picker":
      return (
        <FormItem
          itemCount={itemCount}
          options={["id", "label", "info", "default"]}
          type="font_picker"
          duplicatedOptions={duplicatedOptions}
          itemId={itemId}
          defaultOptions={{
            default: "sans-serif",
          }}
        />
      );
    case "collection":
      return (
        <FormItem
          itemCount={itemCount}
          options={["id", "label", "info"]}
          type="collection"
          duplicatedOptions={duplicatedOptions}
          itemId={itemId}
        />
      );
    case "product":
      return (
        <FormItem
          itemCount={itemCount}
          options={["id", "label", "info"]}
          type="product"
          duplicatedOptions={duplicatedOptions}
          itemId={itemId}
        />
      );
    case "blog":
      return (
        <FormItem
          itemCount={itemCount}
          options={["id", "label", "info"]}
          type="blog"
          duplicatedOptions={duplicatedOptions}
          itemId={itemId}
        />
      );
    case "page":
      return (
        <FormItem
          itemCount={itemCount}
          options={["id", "label", "info"]}
          type="page"
          duplicatedOptions={duplicatedOptions}
          itemId={itemId}
        />
      );
    case "link_list":
      return (
        <FormItem
          itemCount={itemCount}
          options={["id", "label", "info"]}
          type="link_list"
          duplicatedOptions={duplicatedOptions}
          itemId={itemId}
        />
      );
    case "url":
      return (
        <FormItem
          itemCount={itemCount}
          options={["id", "label", "info"]}
          type="url"
          duplicatedOptions={duplicatedOptions}
          itemId={itemId}
        />
      );
    case "video_url":
      return (
        <FormItem
          itemCount={itemCount}
          options={["id", "label", "accept", "placeholder", "info", "default"]}
          type="video_url"
          defaultOptions={defaultOptions}
          duplicatedOptions={duplicatedOptions}
          itemId={itemId}
        />
      );
    case "richtext":
      return (
        <FormItem
          itemCount={itemCount}
          options={["id", "label", "info", "default"]}
          type="richtext"
          duplicatedOptions={duplicatedOptions}
          defaultOptions={{
            ...defaultOptions,
            default: "<p></p>",
          }}
          itemId={itemId}
        />
      );

    case "checkbox":
      return (
        <FormItem
          itemCount={itemCount}
          options={["id", "label", "info", "default"]}
          type="checkbox"
          duplicatedOptions={duplicatedOptions}
          defaultOptions={{
            ...defaultOptions,
            default: "true",
          }}
          itemId={itemId}
        />
      );

    case "range":
      return (
        <FormItem
          itemCount={itemCount}
          options={[
            "id",
            "label",
            "min",
            "max",
            "step",
            "unit",
            "info",
            "default",
          ]}
          type="range"
          duplicatedOptions={duplicatedOptions}
          defaultOptions={{
            ...defaultOptions,
            unit: "px",
          }}
          itemId={itemId}
        />
      );
    case "textarea":
      return (
        <FormItem
          itemCount={itemCount}
          options={["id", "label", "info", "placeholder", "default"]}
          type="textarea"
          defaultOptions={defaultOptions}
          duplicatedOptions={duplicatedOptions}
          itemId={itemId}
        />
      );
    case "number":
      return (
        <FormItem
          itemCount={itemCount}
          options={["id", "label", "info", "placeholder", "default"]}
          extraOptions={["injectVariableInHTML"]}
          type="number"
          duplicatedOptions={duplicatedOptions}
          defaultOptions={defaultOptions}
          itemId={itemId}
        />
      );
    case "select":
      return (
        <FormItem
          itemCount={itemCount}
          options={["id", "label", "info", "default"]}
          subOptions={["value", "label"]}
          totalSubOptions={5}
          type="select"
          defaultOptions={defaultOptions}
          duplicatedOptions={duplicatedOptions}
          duplicatedSubOptions={duplicatedSubOptions}
          itemId={itemId}
        />
      );
    case "radio":
      return (
        <FormItem
          itemCount={itemCount}
          options={["id", "label", "info", "default"]}
          subOptions={["value", "label"]}
          totalSubOptions={5}
          type="radio"
          defaultOptions={defaultOptions}
          duplicatedOptions={duplicatedOptions}
          duplicatedSubOptions={duplicatedSubOptions}
          itemId={itemId}
        />
      );
    case "image_picker":
      return (
        <FormItem
          itemCount={itemCount}
          options={["id", "label", "info"]}
          type="image_picker"
          defaultOptions={defaultOptions}
          duplicatedOptions={duplicatedOptions}
          itemId={itemId}
        />
      );
    default:
      return "none";
  }
};

export default function ItemCopy(props) {
  let {
    defaultValue,
    type,
    id,
    handleOnChange,
    defaultOptions,
    itemCount,
    duplicatedOptions,
    duplicatedSubOptions,
  } = props;

  const items = useStore((state) => state.items);
  const setItems = useStore((state) => state.setItems);
  const updateItems = useStore((state) => state.updateItems);
  const selectedItems = useStore((state) => state.selectedItems);
  const removeItem = useStore((state) => state.removeItem);
  const removeItems = useStore((state) => state.removeItems);
  const updateItem = useStore((state) => state.updateItem);

  /** Responsible to duplicate items. */
  const handleDuplicate = async (_index) => {
    if (selectedItems.length >= 2) {
      let updatedItems = items;
      let copiedItems = [];
      let result = [];

      for (var id of selectedItems) {
        let _json = JSON.parse(
          JSON.stringify(items.filter((e) => e.__id === id)[0]),
        );

        _json.__id = short.generate();
        _json.label = _json.label + " copy";

        // const index = parseInt(itemCount) - 1;

        // updatedItems = JSON.parse(
        //   JSON.stringify(addToIndex(updatedItems, 1, _json)),
        // );

        copiedItems.push(_json);

        await sleep(10);
      }

      result = addObjectToIndex(items, _index, copiedItems).map((e, i) => {
        return {
          ...e,
          order: i + 1,
        };
      });

      setItems(result);

      return;
    }

    /* "$this" is modified once "setItems" is updated. */
    let $this = document.querySelector(`.item[data-item-count="${itemCount}"]`);

    let _json = transformDOMIntoJSON($this, true);
    _json.__id = short.generate();
    // _json.id = _json.id + "_copy";
    // _json.label = _json.label + " copy";
    const index = parseInt(itemCount);

    console.log(items, index, _json);
    const updatedItems = addToIndex(items, index, _json);

    updateItems(updatedItems);
    // focusOnTooltipAfterClone();
  };

  function handleDelete(id) {
    let ids = [];

    /* Multiple */
    if (selectedItems.length >= 1) {
      console.log(selectedItems);

      removeItems(selectedItems);
    } else {
      /* Only one */
      removeItem(id);
    }
  }

  return (
    <li
      key={id}
      data-item-id={id}
      data-item-count={itemCount}
      className={`item`}>
      <div className="item-buttons">
        <button
          title="Delete"
          onClick={async () => {
            resetJsonResult();

            handleDelete(id);
            // handleDeleteItem(id);

            await sleep(100);
            const json = generateJSONSchema();
            setJsonResult(json);
          }}
          className="item-delete item-button">
          <svg viewBox="0 0 20 20" focusable="false" aria-hidden="true">
            <path d="M8 3.994c0-1.101.895-1.994 2-1.994s2 .893 2 1.994h4c.552 0 1 .446 1 .997a1 1 0 0 1-1 .997h-12c-.552 0-1-.447-1-.997s.448-.997 1-.997h4zm-3 10.514v-6.508h2v6.508a.5.5 0 0 0 .5.498h1.5v-7.006h2v7.006h1.5a.5.5 0 0 0 .5-.498v-6.508h2v6.508a2.496 2.496 0 0 1-2.5 2.492h-5c-1.38 0-2.5-1.116-2.5-2.492z" />
          </svg>
        </button>
        <button
          title="Duplicate"
          onClick={(e) => {
            console.log(e);
            const $this = e.target;
            const $parent = $this.closest(`[data-item-count]`);
            const index = parseInt($parent.getAttribute("data-item-count"));

            handleDuplicate(index);
          }}
          className="item-duplicate item-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 14 14"
            height={32}
            width={32}
            strokeWidth={1}>
            <g>
              <rect
                x={3}
                y={3}
                width="10.5"
                height="10.5"
                rx={1}
                transform="translate(16.5 16.5) rotate(180)"
                fill="none"
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M.5,10.5v-9a1,1,0,0,1,1-1h9"
                fill="none"
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </svg>
        </button>
      </div>
      <div className="item-wrapper">
        <select
          onChange={(e) => handleOnChange(e)}
          defaultValue={defaultValue}
          id={id}>
          {schema
            .sort((a, b) => a.id.localeCompare(b.id))
            .map(({ id: _id }) => {
              return (
                <option key={_id} value={_id}>
                  {_id}
                </option>
              );
            })}
        </select>
      </div>
      <div className="item-content">
        {renderElement(
          type,
          id,
          itemCount,
          duplicatedOptions,
          duplicatedSubOptions,
          defaultOptions,
        )}
      </div>

      <div className="item-advanced">
        {/* <p>
          <b>Advanced</b>
        </p>
        <fieldset>
          <label htmlFor="">Inject in HTML</label>
          <input
            data-id={id}
            value={inputHtmlVariable}
            onChange={(e) => handleOnChange(e)}
            type="text"
            placeholder="Selector"
            onChange={(e) => {
              const value = e.target.value.trim();
              const currentID = e.target.getAttribute(`data-id`);

              console.log(currentID);

              if (currentID !== id) {
                return;
              }

              if (value.length <= 0 && item.hasOwnProperty(`htmlVariable`)) {
                item.htmlVariable = "";
                return;
              }

              setInputHtmlVariable(value);

              const item = items.filter((e) => e.__id === id)[0];

              console.log("my item", item);
              item.htmlVariable = value;
              updateItem(item);
            }}
          />
        </fieldset> */}
      </div>
      <br />
    </li>
  );
}
