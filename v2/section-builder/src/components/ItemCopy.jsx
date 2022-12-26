import React, { useState, useEffect, useRef } from "react";
import handleViewport from "react-in-viewport";
import Sortable, { MultiDrag } from "sortablejs";
Sortable.mount(new MultiDrag());

import {
  addToIndex,
  schema,
  sleep,
  transformDOMIntoJSON,
  resetJsonResult,
  generateJSONSchema,
  setJsonResult,
  scrollToItem,
} from "../utils";

import short from "short-uuid";
import "./Item.scss";

import Text from "./Text";
import FormItem from "./FormItem";

import useStore from "../store/store";
import { Select } from "@shopify/polaris";

const renderElement = (
  type,
  itemId,
  itemCount,
  duplicatedOptions,
  duplicatedSubOptions,
  defaultOptions,
) => {
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
          {console.log("look default", typeof defaultOptions, defaultOptions)}
          <FormItem
            itemCount={itemCount}
            options={["id", "label", "info", "placeholder", "default"]}
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
          type="richtext"
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
    handleDeleteItem,
    defaultOptions,
    itemCount,
    handleDelete,
    duplicatedOptions,
    duplicatedSubOptions,
  } = props;

  const items = useStore((state) => state.items);
  const updateItems = useStore((state) => state.updateItems);
  const [mounted, setMounted] = useState(false);

  /** Responsible to duplicate items. */
  const handleDuplicate = async () => {
    /* "$this" is modified once "setItems" is updated. */
    let $this = document.querySelector(`.item[data-item-count="${itemCount}"]`);

    let _json = transformDOMIntoJSON($this);
    delete _json.type;

    console.log("my josn", _json);

    /* ====== */
    const index = parseInt(itemCount) - 1;

    const id = short.generate();

    const _item = {
      id,
      type,
      duplicatedOptions: _json,
    };

    if (_json.hasOwnProperty("options")) {
      _item["duplicatedSubOptions"] = _json.options;
    }

    const updatedItems = addToIndex(items, index, _item);
    updateItems(updatedItems);

    await sleep(100);
    scrollToItem(id);
  };

  useEffect(() => {
    var $items = window.document.querySelector(`.Preview-sortable `);

    if (!$items) {
      return;
    }

    var sortable = Sortable.create($items, {
      animation: 150,
      handle: `.Editor-handle`,
      multiDrag: true, // Enable the plugin
      selectedClass: "sortable-selected", // Class name for selected item
      avoidImplicitDeselect: false, // true - if you don't want to deselect items on outside click

      // Called when an item is selected
      onSelect: function (/**Event*/ evt) {
        console.log("SELECT");
      },

      // Called when an item is deselected
      onDeselect: function (/**Event*/ evt) {
        console.log("DESELECT");
      },
      onEnd: function (e) {
        /* TODO 
		SORTABLE container*/
        console.log("END");
      },
    });
  }, []);

  return (
    <li data-item-count={itemCount} className={`item`}>
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

        <div className="item-buttons">
          <button
            title="Delete"
            tabindex="-1"
            onClick={async () => {
              resetJsonResult();
              handleDeleteItem(id);
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
            onClick={() => {
              handleDuplicate();
            }}
            className="item-button">
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
      <br />
    </li>
  );
}
