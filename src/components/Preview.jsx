import React, { useEffect, useState } from "react";

import "./Preview.scss";

import { useStatePersist as useStickyState } from "use-state-persist";
import { Select, RangeSlider, TextField, Button, Text } from "@shopify/polaris";
import {
  DragHandleMinor,
  ChevronLeftMinor,
  EditMajor,
  HideMinor,
} from "@shopify/polaris-icons";

import Sortable, { MultiDrag } from "sortablejs";
Sortable.mount(new MultiDrag());

import useStore from "../store/store";
import short from "short-uuid";
import {
  _waitForElement,
  convertStringToBoolean,
  createEmptyCopyOfObject,
  generateJSONSchema,
  handleInputChange,
  schema,
  sleep,
} from "../utils";
import Editor from "./Editor";
import Header from "./Header";
import SidebarOptions from "./SidebarOptions";

import { Tooltip as ReactTooltip } from "react-tooltip";

const RenderTextPreview = (data) => {
  return (
    <>
      <TextField
        autoComplete={"off"}
        label={data.label}
        helpText={data.info}
        placeholder={data.placeholder}
        value={data.default}></TextField>
    </>
  );
};

const RenderBlogPreview = (data) => {
  return (
    <>
      <div className="Preview-label">{data.label}</div>
      <button id="" className="Preview-button" type="button">
        <span className="">
          <span className="">Select blog</span>
        </span>
      </button>

      {data.info && data.info !== "" && (
        <div className="Preview-info">{data.info}</div>
      )}
    </>
  );
};

const RenderCheckboxPreview = (data) => {
  const value = convertStringToBoolean(data.default);

  return (
    <>
      <label className="Preview-checkbox-label" htmlFor={data.id}>
        <span className="Preview-checkbox-label-child">
          <span className="Preview-checkbox-label-grandchild">
            <input
              id={data.id}
              type="checkbox"
              className="Preview-checkbox-input"
              checked={value}
            />
            <span className="Preview-checkbox-tick" />
            <span className="Preview-checkbox-tick-siblings">
              <span className="Preview-checkbox-tick-child">
                <span className="Preview-checkbox-tick--hidden" />
                <svg
                  viewBox="0 0 20 20"
                  className="Preview-checkbox-svg"
                  focusable="false"
                  aria-hidden="true">
                  <path d="M14.723 6.237a.94.94 0 0 1 .053 1.277l-5.366 6.193a.834.834 0 0 1-.611.293.83.83 0 0 1-.622-.264l-2.927-3.097a.94.94 0 0 1 0-1.278.82.82 0 0 1 1.207 0l2.297 2.43 4.763-5.498a.821.821 0 0 1 1.206-.056Z" />
                </svg>
              </span>
            </span>
          </span>
        </span>
        <span className="">
          <span className="Preview-checkbox-text">{data.label}</span>
        </span>
      </label>

      {data.info && data.info !== "" && (
        <div className="Preview-info">{data.info}</div>
      )}
    </>
  );
};

const RenderColorPreview = (data) => {
  return (
    <>
      <div className="Preview-item-color-wrapper">
        <button
          style={{
            background: data.default && data.default !== "" ? data.default : "",
          }}
          type="button">
          <div className="Preview-color-button-helper"></div>
        </button>

        <div className="Preview-color-text">
          <label className="Preview-color-label">
            <div className="Preview-color-label-text">{data.label}</div>
          </label>

          <div className="Preview-color-hex">
            {data.default ? data.default : "Transparent"}
          </div>
        </div>
        <svg
          viewBox="0 0 20 20"
          className="Preview-color-svg Preview-icon-database">
          <path d="M10 9c3.866 0 7-1.343 7-3s-3.134-3-7-3-7 1.343-7 3 3.134 3 7 3Zm6.602 0c-.961 1.165-3.554 2-6.602 2-3.048 0-5.64-.835-6.602-2-.258.313-.398.65-.398 1 0 1.657 3.134 3 7 3s7-1.343 7-3c0-.35-.14-.687-.398-1Zm0 4c-.961 1.165-3.554 2-6.602 2-3.048 0-5.64-.835-6.602-2-.258.313-.398.65-.398 1 0 1.657 3.134 3 7 3s7-1.343 7-3c0-.35-.14-.687-.398-1Z" />
        </svg>
      </div>

      {data.info && data.info !== "" && (
        <div className="Preview-info">{data.info}</div>
      )}
    </>
  );
};

const RenderFontPreview = (data) => {
  return (
    <>
      <div className="Preview-label">{data.label}</div>
      <div className="Preview-font-wrapper">
        <span className="Preview-font-title">{data.default}</span>

        <p>Regular</p>

        <div className="Preview-font-button-container">
          <div className="Preview-font-button-box Polaris-ButtonGroup_yy85z Polaris-ButtonGroup--segmented_150jh Polaris-ButtonGroup--fullWidth_zyvh4">
            <button id="FontPicker1" className="Preview-button" type="button">
              <span className="Polaris-Button__Content_xd1mk">
                <span className="Polaris-Button__Text_yj3uv">Change</span>
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="Preview-info">{data.info}</div>
    </>
  );
};

const RenderHeaderPreview = (data) => {
  return (
    <>
      <div className="Preview-content">{data.content}</div>
    </>
  );
};

const RenderImagePickerPreview = (data) => {
  return (
    <>
      <div className="Preview-image-picker-top">
        <div className="Preview-label">{data.label}</div>
        <svg
          viewBox="0 0 20 20"
          className="Preview-color-svg Preview-icon-database">
          <path d="M10 9c3.866 0 7-1.343 7-3s-3.134-3-7-3-7 1.343-7 3 3.134 3 7 3Zm6.602 0c-.961 1.165-3.554 2-6.602 2-3.048 0-5.64-.835-6.602-2-.258.313-.398.65-.398 1 0 1.657 3.134 3 7 3s7-1.343 7-3c0-.35-.14-.687-.398-1Zm0 4c-.961 1.165-3.554 2-6.602 2-3.048 0-5.64-.835-6.602-2-.258.313-.398.65-.398 1 0 1.657 3.134 3 7 3s7-1.343 7-3c0-.35-.14-.687-.398-1Z" />
        </svg>
      </div>

      <div className="Preview-image-box">
        <div className="Preview-button">Select image</div>
      </div>
      <div className="Preview-info">{data.info}</div>
    </>
  );
};

const RenderCollectionPreview = (data) => {
  return (
    <>
      <div className="Preview-label">{data.label}</div>

      <div className="Preview-button">Select collection</div>

      <div className="Preview-info">{data.info}</div>
    </>
  );
};

const RenderLinkListPreview = (data) => {
  return (
    <>
      <div className="Preview-label">{data.label}</div>

      <div className="Preview-button">Select menu</div>

      <div className="Preview-info">{data.info}</div>
    </>
  );
};

const RenderPagePreview = (data) => {
  return (
    <>
      <div className="Preview-label">{data.label}</div>

      <div className="Preview-button">Select page</div>

      <div className="Preview-info">{data.info}</div>
    </>
  );
};

const RenderNumberPreview = (data) => {
  return (
    <>
      <>
        <div className="Preview-label">{data.label}</div>
        <div className="Preview-number">
          <input
            readOnly
            type="text"
            defaultValue={
              data.default && data.default !== "" ? data.default : ""
            }
            placeholder={
              data.placeholder && data.placeholder !== ""
                ? data.placeholder
                : ""
            }
            className="Preview-input"
          />
          <div
            className="Preview-number-arrows Polaris-TextField__Spinner_mzr5w"
            aria-hidden="true">
            <div
              role="button"
              className="Preview-number-arrows-child "
              tabIndex={-1}>
              <div className="Polaris-TextField__SpinnerIcon_185nu">
                <span className="Polaris-Icon_yj27d">
                  <svg
                    viewBox="0 0 20 20"
                    className="Polaris-Icon__Svg_375hu"
                    focusable="false"
                    aria-hidden="true">
                    <path d="M6.902 12h6.196c.751 0 1.172-.754.708-1.268l-3.098-3.432c-.36-.399-1.055-.399-1.416 0l-3.098 3.433c-.464.513-.043 1.267.708 1.267Z" />
                  </svg>
                </span>
              </div>
            </div>
            <div
              role="button"
              className="Preview-number-arrows-child"
              tabIndex={-1}>
              <div className="Polaris-TextField__SpinnerIcon_185nu">
                <span className="Polaris-Icon_yj27d">
                  <svg
                    viewBox="0 0 20 20"
                    className="Polaris-Icon__Svg_375hu"
                    focusable="false"
                    aria-hidden="true">
                    <path d="M13.098 8h-6.196c-.751 0-1.172.754-.708 1.268l3.098 3.432c.36.399 1.055.399 1.416 0l3.098-3.433c.464-.513.043-1.267-.708-1.267Z" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>

        {data.info && data.info !== "" && (
          <div className="Preview-info">{data.info}</div>
        )}
      </>
    </>
  );
};

const RenderParagraphPreview = (data) => {
  return (
    <>
      <div className="Preview-info">{data.content}</div>
    </>
  );
};

const RenderProductPreview = (data) => {
  return (
    <>
      <div className="Preview-label">{data.label}</div>

      <div className="Preview-button">Select product</div>

      <div className="Preview-info">{data.info}</div>
    </>
  );
};

const RenderRadioPreview = (data) => {
  return (
    <>
      <div className="Preview-label">{data.label}</div>

      <div className="Preview-radio">
        <ul>
          {data.hasOwnProperty("options") &&
            data.options &&
            data.options.length >= 1 &&
            data.options.map((e) => (
              <li>
                <label
                  className="Preview-radio-label"
                  htmlFor="PolarisRadioButton1">
                  <span className="Preview-radio-label-child">
                    <span className="Preview-radio-label-gc">
                      <input
                        readOnly
                        checked={e.label === data.default ? true : false}
                        id="PolarisRadioButton1"
                        type="radio"
                      />
                      <span className="Radio-radio-style" />
                    </span>
                  </span>
                  <span className="Radio-preview-text">{e.label}</span>
                </label>
              </li>
            ))}
        </ul>
      </div>

      <div className="Preview-info">{data.info}</div>
    </>
  );
};

const RenderRangePreview = (data) => {
  const updateItem = useStore((state) => state.updateItem);

  return (
    <>
      <div className="Preview-ranger">
        <RangeSlider
          id={`${data.__id}_rangeslider_`}
          data-id-test="x1"
          label={data.label || " "}
          min={data.min}
          max={data.max}
          value={data.default}
          step={data.step}
          helpText={data.info}
          onChange={async (value, element) => {
            // console.log("heo", );

            // let $input = null;
            // $input = document.querySelector(`[for="${element}"]`);

            // if (!$input) {
            //   return;
            // }

            // const $parent = document.querySelector(`[data-item-id]`);
            const id = data.__id;

            const $item = document.querySelector(`.item[data-item-id="${id}"]`);

            let $input = document.querySelector(`input[name='${id}_default']`);

            if (!$input) {
              console.error("No $Input found");
              return;
            }

            $input.value = value;
            $input.dispatchEvent(
              new Event("change", {
                bubbles: true,
              }),
            );

            handleInputChange($item, updateItem);
          }}
          output
          suffix={
            <div className="Preview-info Preview-ranger-unit">
              {data.default}
              {data.unit}
            </div>
          }
        />
      </div>
    </>
  );
};

const RenderRichTextPreview = (data) => {
  return (
    <>
      <div className="Preview-label">{data.label}</div>

      <div className="Preview-richtext">
        <div className="bu_Wz">
          <div>
            <div className="JpXEL">
              <div className="afy8a">
                <section className="_Combo_1q9yt_1">
                  <div className="_ToolbarWrapper_1q9yt_37">
                    <div className="_Toolbar_rzswi_1">
                      <ul className="_Group_rzswi_6">
                        <li role="presentation" className="_Section_wllur_9">
                          <ul className="_Section_rzswi_7">
                            <li className="_Item_wllur_1">
                              <div className="_Button_g7xjx_1">
                                <span>
                                  <button
                                    className="_PlainAction_17y8l_1 _slim_17y8l_138 _iconOnly_17y8l_143 _alignLeft_17y8l_353 _fullWidth_17y8l_358 _truncate_17y8l_485"
                                    aria-label="Bold – Ctrl+B"
                                    aria-disabled="false"
                                    type="button"
                                    aria-pressed="false"
                                    tabIndex={0}
                                    aria-describedby="PolarisTooltipContent8"
                                    data-polaris-tooltip-activator="true">
                                    <div className="_Interior_17y8l_423">
                                      <div className="_PrefixIcon_17y8l_447">
                                        <span className="Polaris-Icon_yj27d">
                                          <span className="Polaris-VisuallyHidden_yrtt5" />
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            className="Polaris-Icon__Svg_375hu"
                                            focusable="false"
                                            aria-hidden="true">
                                            <path d="M11.054 16C13.49 16 15 14.678 15 12.566c0-1.589-1.139-2.778-2.689-2.903v-.066c1.21-.192 2.143-1.289 2.143-2.603C14.454 5.156 13.11 4 10.967 4H7a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h4.054zM8.388 5.871h1.962c1.115 0 1.755.549 1.755 1.514 0 1.014-.727 1.605-2 1.605H8.388V5.871zm0 8.258v-3.484h2.001c1.408 0 2.175.598 2.175 1.721 0 1.148-.743 1.763-2.119 1.763H8.388z" />
                                          </svg>
                                        </span>
                                      </div>
                                    </div>
                                  </button>
                                </span>
                              </div>
                            </li>
                            <li className="_Item_wllur_1">
                              <div className="_Button_g7xjx_1">
                                <span>
                                  <button
                                    className="_PlainAction_17y8l_1 _slim_17y8l_138 _iconOnly_17y8l_143 _alignLeft_17y8l_353 _fullWidth_17y8l_358 _truncate_17y8l_485"
                                    aria-label="Italic – Ctrl+I"
                                    aria-disabled="false"
                                    type="button"
                                    aria-pressed="false"
                                    tabIndex={0}
                                    aria-describedby="PolarisTooltipContent9"
                                    data-polaris-tooltip-activator="true">
                                    <div className="_Interior_17y8l_423">
                                      <div className="_PrefixIcon_17y8l_447">
                                        <span className="Polaris-Icon_yj27d">
                                          <span className="Polaris-VisuallyHidden_yrtt5" />
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            className="Polaris-Icon__Svg_375hu"
                                            focusable="false"
                                            aria-hidden="true">
                                            <path d="M8 5a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2h-1.333l-1.334 8H11a1 1 0 1 1 0 2H7a1 1 0 1 1 0-2h1.333l1.334-8H9a1 1 0 0 1-1-1z" />
                                          </svg>
                                        </span>
                                      </div>
                                    </div>
                                  </button>
                                </span>
                              </div>
                            </li>
                            <li className="_Item_wllur_1">
                              <div className="_Button_g7xjx_1">
                                <span>
                                  <button
                                    className="_PlainAction_17y8l_1 _slim_17y8l_138 _iconOnly_17y8l_143 _alignLeft_17y8l_353 _fullWidth_17y8l_358 _truncate_17y8l_485"
                                    aria-label="Unordered list"
                                    aria-disabled="false"
                                    type="button"
                                    aria-pressed="false"
                                    tabIndex={0}
                                    aria-describedby="PolarisTooltipContent10"
                                    data-polaris-tooltip-activator="true">
                                    <div className="_Interior_17y8l_423">
                                      <div className="_PrefixIcon_17y8l_447">
                                        <span className="Polaris-Icon_yj27d">
                                          <span className="Polaris-VisuallyHidden_yrtt5" />
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            className="Polaris-Icon__Svg_375hu"
                                            focusable="false"
                                            aria-hidden="true">
                                            <path d="M8 9h7a1 1 0 0 1 0 2H8a1 1 0 0 1 0-2zm0-4h7a1 1 0 0 1 0 2H8a1 1 0 0 1 0-2zm0 8h7a1 1 0 0 1 0 2H8a1 1 0 0 1 0-2zM6 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm0 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm0 4a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                                          </svg>
                                        </span>
                                      </div>
                                    </div>
                                  </button>
                                </span>
                              </div>
                            </li>
                          </ul>
                        </li>
                        <li role="presentation" className="_Section_wllur_9">
                          <ul className="_Section_rzswi_7">
                            <li className="_Item_wllur_1">
                              <div className="_Button_g7xjx_1">
                                <span>
                                  <button
                                    className="_PlainAction_17y8l_1 _slim_17y8l_138 _iconOnly_17y8l_143 _alignLeft_17y8l_353 _fullWidth_17y8l_358 _truncate_17y8l_485"
                                    aria-label="Insert Link – Ctrl+K"
                                    aria-disabled="false"
                                    type="button"
                                    aria-pressed="false"
                                    tabIndex={0}
                                    aria-describedby="PolarisTooltipContent11"
                                    data-polaris-tooltip-activator="true">
                                    <div className="_Interior_17y8l_423">
                                      <div className="_PrefixIcon_17y8l_447">
                                        <span className="Polaris-Icon_yj27d">
                                          <span className="Polaris-VisuallyHidden_yrtt5" />
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            className="Polaris-Icon__Svg_375hu"
                                            focusable="false"
                                            aria-hidden="true">
                                            <path d="M7.227 16.4a3.605 3.605 0 0 1-2.566-1.063 3.631 3.631 0 0 1 0-5.131l1.573-1.572a.8.8 0 1 1 1.131 1.132l-1.573 1.57a2.032 2.032 0 0 0 0 2.87c.769.767 2.105.766 2.87 0l1.573-1.572a.8.8 0 1 1 1.132 1.132l-1.573 1.57A3.603 3.603 0 0 1 7.227 16.4zm5.974-4.8a.8.8 0 0 1-.566-1.366l1.573-1.57c.79-.792.79-2.08 0-2.87-.769-.767-2.105-.765-2.87 0L9.766 7.366a.8.8 0 1 1-1.132-1.132l1.572-1.57A3.603 3.603 0 0 1 12.773 3.6c.969 0 1.88.378 2.566 1.063a3.633 3.633 0 0 1 0 5.131l-1.573 1.572a.798.798 0 0 1-.565.234zm-4.802.8a.8.8 0 0 1-.566-1.366l3.201-3.2a.8.8 0 1 1 1.132 1.132l-3.2 3.2a.8.8 0 0 1-.567.234z" />
                                          </svg>
                                        </span>
                                      </div>
                                    </div>
                                  </button>
                                </span>
                              </div>
                            </li>
                          </ul>
                        </li>
                      </ul>
                      <ul className="_Group_rzswi_6">
                        <li role="presentation" className="_Section_wllur_9">
                          <ul className="_Section_rzswi_7">
                            <li className="_Item_wllur_1">
                              <div
                                aria-controls="OnlineStoreUiPopover10"
                                aria-expanded="false"
                                aria-haspopup="dialog">
                                <div className="_Button_g7xjx_1">
                                  <span>
                                    <button
                                      className="_PlainAction_17y8l_1 _slim_17y8l_138 _iconOnly_17y8l_143 _alignLeft_17y8l_353 _fullWidth_17y8l_358 _truncate_17y8l_485"
                                      aria-label="Insert dynamic source"
                                      aria-disabled="false"
                                      type="button"
                                      aria-pressed="false"
                                      tabIndex={0}
                                      aria-describedby="PolarisTooltipContent12"
                                      data-polaris-tooltip-activator="true">
                                      <div className="_Interior_17y8l_423">
                                        <div className="_PrefixIcon_17y8l_447">
                                          <span className="Polaris-Icon_yj27d">
                                            <span className="Polaris-VisuallyHidden_yrtt5" />
                                            <svg
                                              viewBox="0 0 20 20"
                                              className="Polaris-Icon__Svg_375hu"
                                              focusable="false"
                                              aria-hidden="true">
                                              <path d="M10 9c3.866 0 7-1.343 7-3s-3.134-3-7-3-7 1.343-7 3 3.134 3 7 3Zm6.602 0c-.961 1.165-3.554 2-6.602 2-3.048 0-5.64-.835-6.602-2-.258.313-.398.65-.398 1 0 1.657 3.134 3 7 3s7-1.343 7-3c0-.35-.14-.687-.398-1Zm0 4c-.961 1.165-3.554 2-6.602 2-3.048 0-5.64-.835-6.602-2-.258.313-.398.65-.398 1 0 1.657 3.134 3 7 3s7-1.343 7-3c0-.35-.14-.687-.398-1Z" />
                                            </svg>
                                          </span>
                                        </div>
                                      </div>
                                    </button>
                                  </span>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="_Children_1q9yt_62" tabIndex={-1}>
                    <div className="_SlateWrapper_1q9yt_87">
                      <div
                        className="_Slate_1q9yt_87"
                        zindex={-1}
                        style={{
                          position: "relative",
                          outline: "none",
                          whiteSpace: "pre-wrap",
                          overflowWrap: "break-word",
                        }}>
                        <div data-slate-node="element">
                          <p
                            data-slate-node="element"
                            className="_Paragraph_vxze7_1">
                            <span data-slate-node="text">
                              <span data-slate-leaf="true">
                                <span data-slate-string="true">
                                  {data.default &&
                                    data.default
                                      .replaceAll(`<p>`, "")
                                      .replaceAll(`</p>`, "")}
                                </span>
                              </span>
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="Preview-info">{data.info}</div>
    </>
  );
};

const RenderSelectPreview = (data) => {
  return (
    <>
      <div className="Preview-select">
        <Select
          readOnly={true}
          label={data.label}
          helpText={data.info}
          options={
            data.options &&
            data.options.map((e) => {
              return {
                label: e.label,
                value: e.value,
              };
            })
          }
        />
      </div>
    </>
  );
};

const RenderTextareaPreview = (data) => {
  return (
    <>
      <div className="Preview-textarea">
        <TextField
          autoComplete={"off"}
          label={data.label}
          helpText={data.info}
          placeholder={data.placeholder}
          multiline={4}
          defaultValue={data.default}></TextField>
      </div>
    </>
  );
};

const RenderUrlPreview = (data) => {
  return (
    <>
      <div className="Preview-url">
        <TextField
          autoComplete={"off"}
          label={data.label}
          helpText={data.info}
          placeholder="Paste a link or search"
          defaultValue={data.default}></TextField>
        <svg
          viewBox="0 0 20 20"
          className="Preview-color-svg Preview-icon-database">
          <path d="M10 9c3.866 0 7-1.343 7-3s-3.134-3-7-3-7 1.343-7 3 3.134 3 7 3Zm6.602 0c-.961 1.165-3.554 2-6.602 2-3.048 0-5.64-.835-6.602-2-.258.313-.398.65-.398 1 0 1.657 3.134 3 7 3s7-1.343 7-3c0-.35-.14-.687-.398-1Zm0 4c-.961 1.165-3.554 2-6.602 2-3.048 0-5.64-.835-6.602-2-.258.313-.398.65-.398 1 0 1.657 3.134 3 7 3s7-1.343 7-3c0-.35-.14-.687-.398-1Z" />
        </svg>
      </div>
    </>
  );
};

const RenderVideoUrlPreview = (data) => {
  return (
    <>
      <div className="Preview-video">
        <TextField
          label={data.label}
          helpText={data.info}
          placeholder={data.placeholder}
          defaultValue={data.default}></TextField>
      </div>
    </>
  );
};

export default function Preview() {
  const addItem = useStore((state) => state.addItem);
  const setItems = useStore((state) => state.setItems);

  const selectedItems = useStore((state) => state.selectedItems);
  const addSelectedItem = useStore((state) => state.addSelectedItem);
  const removeSelectedItem = useStore((state) => state.removeSelectedItem);
  const removeAllSelectedItems = useStore(
    (state) => state.removeAllSelectedItems,
  );

  const items = useStore((state) => state.items);
  const [type, setType] = useStickyState("@type", "text");
  const [mustUpdate, setMustUpdate] = useStickyState("@mustUpdate", false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (mustUpdate) {
      setTimeout(() => {
        setItems([...items]);
        setMustUpdate(false);
      }, 100);
    }
  }, [mustUpdate]);

  function addItemToList(_item = null) {
    const __id = short.generate();
    const index = items.length + 1;

    const item = _item ? _item : type;

    addItem(
      ...[
        {
          __id,
          type: item.toLowerCase(),
          label: `${item} ${index}`,
          id: `${item}_${index}`,
          content: `${item}`,
          order: index,
        },
      ],
    );
  }

  useEffect(() => {
    var $items = window.document.querySelector(`.Preview-sortable `);

    if (!$items) {
      return;
    }

    var sortable = Sortable.create($items, {
      animation: 150,
      handle: `.Preview-handle`,
      multiDrag: true,
      selectedClass: "sortable-selected",
      avoidImplicitDeselect: false,

      onSelect: (e, i) => {
        const id = e.item.getAttribute("data-item-id");
        addSelectedItem(id);
      },

      onDeselect: async (e) => {
        await sleep(25);
        const $item = document.querySelector(`.sortable-selected`);

        if ($item) {
          const id = e.item.getAttribute("data-item-id");
          removeSelectedItem(id);
          return;
        }
        removeAllSelectedItems();
      },

      onEnd: function (e) {
        const _items = useStore.getState().items;

        let newOrder = [];
        const $items = document.querySelectorAll(
          `.Preview-sortable [data-item-id]`,
        );

        for (var [i, each] of $items.entries()) {
          /* add item to updated object */
          const id = each.getAttribute(`data-item-id`);
          newOrder.push(id);

          /* Update count (order) of items */
          const index = i + 1;
          each.setAttribute(`data-item-order`, index);
        }

        let sorted = _items
          .sort((a, b) => newOrder.indexOf(a.__id) - newOrder.indexOf(b.__id))
          .map((e, i) => {
            e.order = i + 1;
            return e;
          });

        useStore.setState({
          items: _items,
        });

        setTimeout(() => {
          localStorage.setItem(`items`, JSON.stringify(JSON.stringify(sorted)));
        }, 100);

        setMustUpdate(true);
      },
    });
  }, []);

  function Tooltip(props) {
    const tooltipId = `${props.content || ""}${props.title || ""}${
      props.theme || ""
    }${props.place || ""}`;
    return (
      <div>
        <ReactTooltip
          id={tooltipId}
          type={props.theme}
          effect="solid"
          place={props.place}>
          {props.title && <p className="title">{props.title}</p>}
          <p className="content">{props.content}</p>
        </ReactTooltip>
        <span data-tip data-for={tooltipId}>
          {props.children}
        </span>
      </div>
    );
  }

  return (
    <>
      <SidebarOptions></SidebarOptions>
      <div className="Preview">
        <div className="Preview-top">
          <div className="Preview-return">
            <Button monochrome plain outline={false}>
              <ChevronLeftMinor />
            </Button>
          </div>
          <span className="Preview-title">
            <Text variant="headingSm" as="p">
              Previewing {items && items.length >= 1 && items.length} item(s)
            </Text>
          </span>
        </div>

        <div className="Preview-wrapper">
          <div className="Preview-sortable">
            {items &&
              items
                .sort((a, b) => a.order - b.order)
                .map((e, i) => {
                  const index = i + 1;
                  const props = {
                    ...e,
                    itemCount: index,
                  };

                  const content = { index, type: e.type, props };
                  return (
                    <div
                      key={e.__id}
                      data-item-id={e.__id}
                      data-item-count={index}
                      data-tooltip-content={JSON.stringify(content)}
                      className={`Preview-item Preview-item--${e.type}`}>
                      {(() => {
                        if (e.type === "text") {
                          return <RenderTextPreview {...props} />;
                        } else if (e.type === "blog") {
                          return <RenderBlogPreview {...props} />;
                        } else if (e.type === "checkbox") {
                          return <RenderCheckboxPreview {...props} />;
                        } else if (e.type === "color") {
                          return <RenderColorPreview {...props} />;
                        } else if (e.type === "font_picker") {
                          return <RenderFontPreview {...props} />;
                        } else if (e.type === "header") {
                          return <RenderHeaderPreview {...props} />;
                        } else if (e.type === "image_picker") {
                          return <RenderImagePickerPreview {...props} />;
                        } else if (e.type === "collection") {
                          return <RenderCollectionPreview {...props} />;
                        } else if (e.type === "link_list") {
                          return <RenderLinkListPreview {...props} />;
                        } else if (e.type === "number") {
                          return <RenderNumberPreview {...props} />;
                        } else if (e.type === "page") {
                          return <RenderPagePreview {...props} />;
                        } else if (e.type === "paragraph") {
                          return <RenderParagraphPreview {...props} />;
                        } else if (e.type === "product") {
                          return <RenderProductPreview {...props} />;
                        } else if (e.type === "radio") {
                          return <RenderRadioPreview {...props} />;
                        } else if (e.type === "range") {
                          return <RenderRangePreview {...props} />;
                        } else if (e.type === "richtext") {
                          return <RenderRichTextPreview {...props} />;
                        } else if (e.type === "select") {
                          return <RenderSelectPreview {...props} />;
                        } else if (e.type === "textarea") {
                          return <RenderTextareaPreview {...props} />;
                        } else if (e.type === "url") {
                          return <RenderUrlPreview {...props} />;
                        } else if (e.type === "video_url") {
                          return <RenderVideoUrlPreview {...props} />;
                        }
                      })()}

                      {/* <Editor data={props}></Editor> */}

                      <div className="Preview-item-buttons">
                        <button className="Preview-handle Preview-icon-button">
                          <DragHandleMinor></DragHandleMinor>
                        </button>
                      </div>
                    </div>
                  );
                })}
          </div>
          <div className="Preview-buttons" style={{ display: "flex" }}>
            <Select
              value={type}
              options={Object.values(schema)
                .map((e) => e.id)
                .sort()
                .map((e) => {
                  return {
                    label: e,
                    value: e,
                  };
                })}
              onChange={(value) => {
                if (type !== value) {
                  setType(value);
                  addItemToList(value);
                }
              }}></Select>
            <Button
              onClick={() => {
                addItemToList();
              }}>
              Add
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
