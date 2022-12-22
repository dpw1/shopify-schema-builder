import React, { useEffect } from "react";
import "./Preview.scss";

import { useStatePersist as useStickyState } from "use-state-persist";
import { schema } from "../utils";

import useStore from "../store/store";
export default function Preview() {
  const globalJson = useStore((state) => state.globalJson);

  const RenderTextPreview = (data) => {
    return (
      <>
        <div className="Preview-label">{data.label}</div>
        <input
          type="text"
          value={data.default && data.default !== "" ? data.default : ""}
          placeholder={
            data.placeholder && data.placeholder !== "" ? data.placeholder : ""
          }
          className="Preview-input"
        />

        {data.info && data.info !== "" && (
          <div className="Preview-info">{data.info}</div>
        )}
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
    return (
      <>
        <label className="Preview-checkbox-label" htmlFor={data.id}>
          <span className="Preview-checkbox-label-child">
            <span className="Preview-checkbox-label-grandchild">
              <input
                id={data.id}
                type="checkbox"
                className="Preview-checkbox-input"
                checked={data.default}
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
              background:
                data.default && data.default !== "" ? data.default : "",
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
              type="text"
              value={data.default && data.default !== "" ? data.default : ""}
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
    {
      console.log("monkey", data);
    }
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

  return (
    <div className="Preview">
      <h2 className="Preview-title">Preview</h2>
      {globalJson &&
        globalJson.length >= 1 &&
        JSON.parse(globalJson).map((e) => {
          return (
            <div className={`Preview-item Preview-item--${e.type}`}>
              {(() => {
                if (e.type === "text") {
                  return <RenderTextPreview {...e} />;
                } else if (e.type === "blog") {
                  return <RenderBlogPreview {...e} />;
                } else if (e.type === "checkbox") {
                  return <RenderCheckboxPreview {...e} />;
                } else if (e.type === "color") {
                  return <RenderColorPreview {...e} />;
                } else if (e.type === "font_picker") {
                  return <RenderFontPreview {...e} />;
                } else if (e.type === "header") {
                  return <RenderHeaderPreview {...e} />;
                } else if (e.type === "image_picker") {
                  return <RenderImagePickerPreview {...e} />;
                } else if (e.type === "collection") {
                  return <RenderCollectionPreview {...e} />;
                } else if (e.type === "link_list") {
                  return <RenderLinkListPreview {...e} />;
                } else if (e.type === "number") {
                  return <RenderNumberPreview {...e} />;
                } else if (e.type === "page") {
                  return <RenderPagePreview {...e} />;
                } else if (e.type === "paragraph") {
                  return <RenderParagraphPreview {...e} />;
                } else if (e.type === "product") {
                  return <RenderProductPreview {...e} />;
                } else if (e.type === "radio") {
                  return <RenderRadioPreview {...e} />;
                }
              })()}
            </div>
          );
        })}
    </div>
  );
}
