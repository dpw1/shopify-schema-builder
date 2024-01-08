import short from "short-uuid";
import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import useStore from "./store/store";

export const initialState = {
  activeSection: null,
  sectionName: "Test",
  count: 0,
};

export function _waitForElement(selector, delay = 50, tries = 100) {
  const element = document.querySelector(selector);

  if (!window[`__${selector}`]) {
    window[`__${selector}`] = 0;
    window[`__${selector}__delay`] = delay;
    window[`__${selector}__tries`] = tries;
  }

  function _search() {
    return new Promise((resolve) => {
      window[`__${selector}`]++;
      setTimeout(resolve, window[`__${selector}__delay`]);
    });
  }

  if (element === null) {
    if (window[`__${selector}`] >= window[`__${selector}__tries`]) {
      window[`__${selector}`] = 0;
      return Promise.resolve(null);
    }

    return _search().then(() => _waitForElement(selector));
  } else {
    return Promise.resolve(element);
  }
}

/* Detects input changes (typing) on a <input> and update the JSON store's accordingly.
  
  
$item = document.querySelector(`.item`) OR an event element from the listener
updateItem = store.js function to update the JSON
  
  */
export function handleInputChange(_$item, updateItem) {
  let $item = null;

  if (_$item instanceof Node && _$item.classList.contains("item")) {
    $item = _$item;
  }

  if (!$item) {
    try {
      $item = _$item.target.closest(`.item`);
    } catch (err) {
      const $aux = document.querySelector(`#${_$item}`);
      $item = $aux.closest(`.item`);
    }
  }

  const json = transformDOMIntoJSON($item);

  console.log("updated json (formitem.js): ", json);

  updateItem(json);

  return;
}

export function duplicate() {
  const $button = document.querySelector(
    `.Editor [data-item-count] .item-duplicate`,
  );

  if (!$button) {
    return;
  }

  console.log("duplicate: ", $button);

  $button.click();
}

/**
 *
 * Inserts liquid variable into HTML. Say you have the variable section.settings.text and the elemet <p class="my-text"></p>
 *
 * The end result will be:
 *
 * <p class="my-text">{{ text }}</p>
 *
 * @param {string} html = user's section code
 * @param {CSS selector} selector = selector of the element that should take the variable. Ex: .my-text
 * @param {string} variable = the variable to be injected. Ex: {{text}}
 */
export function insertLiquidVariableInHtml(html, selector, variable) {
  if (!variable.includes("{{") || !variable.includes("}}")) {
    throw new Error("Variable must include {{ and }}.");
  }

  variable = variable.replace(/{{\s*([^}\s]+)\s*}}/g, "{{ $1 }}");

  const container = document.createElement("div");
  container.innerHTML = html;

  const targetElement = container.querySelector(selector);

  if (targetElement) {
    targetElement.textContent = variable;

    const modifiedHtml = container.innerHTML;

    const modifiedFullHtml = html.replace(html, modifiedHtml);
    return modifiedFullHtml;
  } else {
    console.log(`Element with selector "${selector}" not found in HTML.`);
    return html;
  }
}

/**
 * 
 * returns only items containing a certain property.
 * 
 * Ex:
 * 
 * const filteredArray = filterByProperty(inputArray, "injectVariableInHTMLSelector");
  console.log(filteredArray);
 * 
 * @param {*} arr 
 * @param {*} property 
 * @returns 
 */
export function filterItemsWithProperty(arr, property) {
  return arr.filter((item) => property in item);
}

export const schema = [
  { id: "header" },
  { id: "paragraph" },
  { id: "text" },
  { id: "color" },
  { id: "font_picker" },
  { id: "collection" },
  { id: "product" },
  { id: "blog" },
  { id: "page" },
  { id: "link_list" },
  { id: "range" },
  { id: "url" },
  { id: "video_url" },
  { id: "richtext" },
  { id: "image_picker" },
  { id: "checkbox" },
  { id: "textarea" },
  { id: "number" },
  { id: "select" },
  { id: "radio" },
];

/* order
null = default order
"a-z" => sort variables from a to z
"z-a" => sort variables from z to a
*/

export function convertToLiquidVariables(_json, order = "default") {
  let json = sortSchemaJSONSettingsAlphabetically(_json, order);

  let variables = [];
  for (var each of json) {
    const id = each.id;

    if (id) {
      const variable = `{% assign ${id} = section.settings.${id} %}`;
      variables.push(variable);
    }
  }

  const result = `{% comment %}EZFY Variables Liquid [start]{% endcomment %}
\t${variables.join("\n\t")}
{% comment %}EZFY Variables Liquid [end]{% endcomment %}`;

  return result.trim();
}

export function updateLiquidVariablesDOM(variables) {
  const $textarea = document.querySelector(`#CodeTable-variables`);

  const showSectionText =
    localStorage.getItem(`section-text`) === "true" ? true : false;

  if (!$textarea) {
    return;
  }

  if (showSectionText) {
    variables = variables.replaceAll(`section.`, "");
  }

  $textarea.value = variables;
}

export function copyToClipboard(text) {
  if (window.clipboardData && window.clipboardData.setData) {
    // IE specific code path to prevent textarea being shown while dialog is visible.
    return window.clipboardData.setData("Text", text);
  } else if (
    document.queryCommandSupported &&
    document.queryCommandSupported("copy")
  ) {
    var textarea = document.createElement("textarea");
    textarea.textContent = text;
    textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in MS Edge.
    document.body.appendChild(textarea);
    textarea.select();
    try {
      return document.execCommand("copy"); // Security exception may be thrown by some browsers.
    } catch (ex) {
      console.warn("Copy to clipboard failed.", ex);
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

/* Updates the textarea with the section's JSON from the schema. */
export const updateJSONDOM = (json) => {
  try {
    const $textarea = window.document.getElementById(`CodeTable-result`);
    $textarea.value = json;
  } catch (err) {
    //console.error("Couldn't update textarea.");
  }
};

export const focusDropdown = (delay = 50) => {
  setTimeout(() => {
    const $lastItem = document.querySelector(
      `.Creator .item:last-of-type .item-wrapper:nth-child(1) select`,
    );

    if (!$lastItem) {
      return;
    }

    $lastItem.focus();
  }, delay);
};

/* This function converts a DOM item to pretty, Shopify-section-friendly JSON. 

The one like:

{"id": "number", "label": "Quantity" ... etc}

It will add an additional __id for local reference
*/
export const transformDOMIntoJSON = (each) => {
  let _json;

  const $attributes = each.querySelectorAll(`.FormItem-attr`);
  const $suboptions = each.querySelectorAll(`.FormItem-suboption`);

  const __id = each.getAttribute(`data-item-id`);
  const type = each.querySelector("select").value;

  _json = {
    type,
    __id,
  };

  for (const attribute of $attributes) {
    const name = attribute
      .querySelector(`[data-label-name]`)
      .getAttribute(`data-label-name`);

    let value = attribute.querySelector(`input`).value;

    /* Clean and format based on Shopify section rules for JSON. */

    /* type is 'richtext' and contains 'default', add <p> to it. */
    if (type === "richtext" && name === "default" && value !== "") {
      value = `<p>${value}</p>`;
    }

    /* type is 'textarea', replace all line breaks for liquid-friendly line breaks */
    if (type === "textarea" && name === "default" && value !== "") {
      value = value.replace(/\\n/g, `\n`);
    }

    /* type is "checkbox" and there is a "default", convert it to boolean */
    if (type === "checkbox" && name === "default") {
      const $checkbox = each.querySelector(
        `[label='default'][type="checkbox"]`,
      );

      value = $checkbox.checked ? "true" : "false";
    }

    /* type is "number" and there is a "default", convert it to integer */
    if (type === "number" && name === "default" && value !== "") {
      value = parseInt(value);
    }

    /* type is "range", convert values to integer */
    if (
      type === "range" &&
      value !== "" &&
      (name === "default" ||
        name === "min" ||
        name === "max" ||
        name === "step")
    ) {
      value = parseInt(value);
    }

    /* If there is no property 'info', ignore */
    if (name === "info" && (value === "" || !value)) {
      continue;
    }

    /* If there is no property 'default', ignore */
    if (name === "default" && (value === "" || !value)) {
      continue;
    }

    /* If there is no property 'placeholder', ignore */
    if (name === "placeholder" && (value === "" || !value)) {
      continue;
    }

    _json[name] = value;
  }

  /* type is 'select' or 'radio', process array of objects. */
  if (
    (type === "select" || type === "radio") &&
    $suboptions &&
    $suboptions.length >= 1
  ) {
    let _suboptions = [];

    for (const [index, suboption] of $suboptions.entries()) {
      let _suboptionsJSON = {};

      /* Getting all the sub options available. */
      const $inputs = suboption.querySelectorAll(`input`);

      [...$inputs].map(($input) => {
        try {
          const labelName = $input.getAttribute("label");
          const value = $input.value;

          if (value === "") {
            _suboptionsJSON = delete _suboptionsJSON[labelName];
            return null;
          }

          _suboptionsJSON[labelName] = value;
        } catch (err) {}
      });

      if (typeof _suboptionsJSON !== "boolean") {
        _suboptions.push(_suboptionsJSON);
      }
    }

    _suboptions = _suboptions.map((e, i) => {
      e.order = i + 1;
      return e;
    });

    _json["options"] = _suboptions;
  }

  return _json;
};

/* Convert the ugly JSON from the store.js to "Shopify section ready" schema */
export const generateJSONSchema = () => {
  const $items = window.document.querySelectorAll(`.item`);
  let finalJSON = [];

  if (!$items) {
    return;
  }

  for (const each of $items) {
    const JSON = transformDOMIntoJSON(each);
    finalJSON.push(JSON);
  }

  const result = JSON.stringify(finalJSON, null, 2);

  return result;
};

export function createEmptyCopyOfObject(source, isArray) {
  var o = Array.isArray(source) ? [] : {};
  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      var t = typeof source[key];
      o[key] =
        t == "object"
          ? createEmptyCopyOfObject(source[key])
          : { string: "", number: 0, boolean: false }[t];
    }
  }
  return o;
}

/* Converts a typical Shopify section schema into a EZFY Section Builder JSON. */
export const convertSchemaJSONToItems = (json) => {
  return json.map((e, i) => {
    const order = i + 1;

    return {
      __id: short.generate(),
      order,
      ...e,
    };
  });
};

function sortSchemaJSONSettingsAlphabetically(_items, order = "default") {
  if (!_items || _items.length <= 0) {
    throw new Error("Invalid array of items");
  }

  const items = [..._items].filter((e) => e.hasOwnProperty("id"));

  if (order === "a-z") {
    items.sort((a, b) => {
      if (a.id < b.id) {
        return -1;
      }
      if (a.id > b.id) {
        return 1;
      }
      return 0;
    });
  }

  if (order === "z-a") {
    items.sort((a, b) => {
      if (a.id < b.id) {
        return 1;
      }
      if (a.id > b.id) {
        return -1;
      }
      return 0;
    });
  }

  return items;
}

export function generateCSSVariables(_items, order = "default") {
  const items = sortSchemaJSONSettingsAlphabetically([..._items], order);

  let variables = ``;
  let i = 0;

  for (var [index, each] of items.entries()) {
    if (each.hasOwnProperty("id")) {
      variables += `\t--${each.id}: {{ ${each.id} }};\n`;
    }

    i += 1;
  }

  const result = `
  {% comment %}EZFY Variables CSS [start]{% endcomment %}
<style data-ezfy-custom-variables="https://ezfycode.com">
\t[id*='{{ section.id }}']{
\t${variables.trim()}
\t}
</style>
{% comment %}EZFY Variables CSS [end]{% endcomment %}`.trim();

  return result;
}

export function generateJavascriptVariables(_items, order = "default") {
  const items = sortSchemaJSONSettingsAlphabetically([..._items], order);

  const backTickReplace = "|ezfyezfy|";
  let variables = ``;
  let i = 0;

  for (var [index, each] of items.entries()) {
    if (each.hasOwnProperty("id")) {
      variables +=
        `\t${each.id}: ${backTickReplace}{{ ${each.id} }}${backTickReplace},\n`.replaceAll(
          backTickReplace,
          "`",
        );
    }

    i += 1;
  }

  const result = `
  {% comment %}EZFY Variables Javascript [start]{% endcomment %}
  <script data-ezfy-custom-variables="https://ezfycode.com">
  window['{{ section.id }}--variables'] = {
  \t${variables.trim()}
  }
</script>
{% comment %}EZFY Variables Javascript [end]{% endcomment %}`.trim();

  return result;
}

/* Responsible to update the textareas. */
export const updateJSONAndVariables = async () => {
  const json = generateJSONSchema();
  const variables = convertToLiquidVariables(json);

  updateJSONDOM(json);
  await sleep(10);
  updateLiquidVariablesDOM(variables);
  await sleep(10);
  updateSectionWithUpdatedSchema(json);
};

export const clearResultsTextarea = (_) => {
  const $section = document.querySelector(`#sectionResult`);

  if (!$section) {
    return;
  }

  $section.value = "";
};

export const extractSchemaFromCode = (importedSection, addItems) => {
  function _extractTextBetween(text, start, end) {
    if (!start || !end) {
      throw new Error(`Please add a "start" and "end" parameter`);
    }

    return text.split(start)[1].split(end)[0];
  }

  const _json = _extractTextBetween(
    importedSection,
    `{% schema %}`,
    `{% endschema %}`,
  );

  const json = JSON.parse(_json).settings;

  console.log("extract", json);
  const op = convertSchemaJSONToItems(json);

  console.log("result", op);

  addItems(op);
};

/* Sets the current JSON edited via the DOM items. */
export const setJsonResult = (_json) => {
  let initialState = localStorage.getItem("json_initial_state");

  if (!initialState) {
    initialState = _json;
    localStorage.setItem("json_initial_state", initialState);
  }

  //   console.log("UPDATING JSON RESULT", initialState);

  const _previous = localStorage.getItem("json_results");
  const previous = _previous ? JSON.parse(_previous).current : {};

  const json = {
    initialState,
    previous,
    current: _json,
  };

  const result = JSON.stringify(json);

  localStorage.setItem("json_results", result);
};

function _scrollTo(el, yOffset = 0) {
  const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

  window.scrollTo({ top: y, behavior: "smooth" });
}

/* Scrolls to item with specific ID */
export const scrollToItem = (id) => {
  const $select = document.querySelector(`[id*='${id}']`);

  if (!$select) {
    return;
  }

  const $parent = $select.closest(`li`);

  if (!$parent) {
    return;
  }

  return _scrollTo($parent, 380);
};

/* Gets the current JSON being edited via the DOM items.
It's all persisted via the local storage instead of using the local store.

THe local store (store.js) was avoided because it was breaking the inputs. */
export const getJsonResult = (_) => {
  const _json = localStorage.getItem("json_results");

  if (!_json) {
    return {};
  }

  const json = JSON.parse(_json);

  const result = {
    initialState: JSON.parse(json.initialState),
    previous: JSON.parse(json.previous),
    current: JSON.parse(json.current),
  };

  // console.log("getjs", result);
  return result;
};

export const resetJsonResult = (_) => {
  localStorage.removeItem("json_results");
};

/* This takes the section the user added and update its JSON with the new schema edited in the app's UI */
export const updateSectionWithUpdatedSchema = async (json) => {
  const $section = window.document.querySelector(`#sectionCode`);
  const $result = window.document.querySelector(`#sectionResult`);

  try {
    const _result = $result.value.trim();
    const section = _result.length >= 1 ? _result : $section.value.trim();
    // const section = $section.value;

    if (!/{% schema %}/gim.test(section) || section.trim() === "") {
      return;
    }

    const _schema = _extractTextBetween(
      section,
      `{% schema %}`,
      `{% endschema %}`,
    );
    let schema = JSON.parse(_schema);

    schema.settings = JSON.parse(json);

    const result = JSON.stringify(schema, null, 2);

    const _updatedSection = replaceTextBetween(
      section,
      `{% schema %}`,
      `{% endschema %}`,
      result,
    );

    /* This would replace all the section.settings for [id]section.settings[id] to be able to track later on,
    but Dawn theme has a different way to set these. It must be updated */
    // console.log("i orc -- ", /\[ezfyid_/gim.test(_updatedSection));

    // const updatedSection = /\[ezfyid_/gim.test(_updatedSection)
    //   ? _updatedSection
    //   : replaceSectionSettingIdsOnFirstRender(_updatedSection);

    $result.value = _updatedSection.trim();
  } catch (err) {}
};

/* This will attach EZFY's unique ID to the section.settings in the code.

So, if in the code it's section.settings.name, it will be [ezfyid_xx]section.settings.name[ezfyid_xx] */
export const replaceSectionSettingIdsOnFirstRender = (section) => {
  const _json = getJsonResult();

  for (var each of _json.initialState) {
    if (each.hasOwnProperty("id")) {
      const __id = `${each.__id}`;

      const regex = new RegExp(`(section.settings.${each.id}?([\\s|}]))`, "g");

      section = section.replaceAll(
        regex,
        `[ezfyid_${__id}]section.settings.${each.id}[ezfyid_${__id}]$2`,
      );
    }
  }

  return section;
};

/* This will remove the ID added via the "replaceSectionSettingIdsOnFirstRender" function.  */
export const updateSectionSettings = (id, value, type = "section") => {
  const $result = window.document.querySelector(`#sectionResult`);

  if (!$result) {
    return;
  }

  const result = $result.value.trim();

  if (result === "") {
    return;
  }

  const regex = new RegExp(`\\[ezfyid_${id}\\](.*)\\[ezfyid_${id}\\]`, "g");

  const updated = result.replaceAll(
    regex,
    `[ezfyid_${id}]${type}.settings.${value}[ezfyid_${id}]`,
  );

  $result.value = updated;
};

/*
This is used to rename the section's ids.  This function does the following:

1. Compares two states (previous and current)
2. Check which ID of the items was lastly modified
3. Returns both the old ID and the current ID. 


Let's say you have "section.settings.ok" in your code, and you modify it to "ok2". 
This code will show up bth the "ok" and "ok2" so you can modify them in the section. */
export const getIdThatWasModified = (
  state,
  previousState,
  type = "section",
) => {
  const isSameUser = (state, previousState) => state.id === previousState.id;

  const onlyInLeft = (left, right, compareFunction) =>
    left.filter(
      (leftValue) =>
        !right.some((rightValue) => compareFunction(leftValue, rightValue)),
    );

  const onlyInState = onlyInLeft(state, previousState, isSameUser);
  const onlyInPreviousState = onlyInLeft(previousState, state, isSameUser);

  console.log("modified ids", onlyInState);

  if (!onlyInPreviousState[0] || !onlyInState[0]) {
    return "";
  }

  const previousIds = onlyInState.map((e) => e.id);
  const ids = onlyInPreviousState.map((e) => e.id);

  let result = [];

  for (const [i, each] of ids.entries()) {
    result.push({
      previous: `${type}.settings.${previousIds[i]}`,
      current: `${type}.settings.${ids[i]}xxx`,
    });
  }

  return result;
};

/* Removes all IDs from the modified section, so it can be used in production. 

This function will:

1- remove all the "ezfyid_" added to keep track of the "section.settings" variables. 

2- clean the schema JSON to remove all of the __id. */
export const cleanSectionCode = (section) => {
  /* Removes ezfyid instances */
  const regex = new RegExp(`\\[ezfyid_.*?\\]`, "ug");

  section = section.replaceAll(regex, "");

  /* Removes __id from JSON */
  const _schema = _extractTextBetween(
    section,
    `{% schema %}`,
    `{% endschema %}`,
  );

  let schema = JSON.parse(_schema);

  const _result = schema.settings.map((e) => {
    if (e.hasOwnProperty("__id")) {
      delete e.__id;
    }
    return e;
  });

  schema.settings = _result;

  const result = schema;

  const updatedSection = replaceTextBetween(
    section,
    `{% schema %}`,
    `{% endschema %}`,
    JSON.stringify(result, null, 2),
  );

  return updatedSection;
};

function removeLastCharacter(str, char) {
  return str
    .split("")
    .reverse()
    .join("")
    .replace(char, "")
    .split("")
    .reverse()
    .join("");
}

/* 

THIS IS OUTDATED.

Use "convertToLiquidVariables" instead
*/
export function generateLiquidVariables(settings) {
  const items = JSON.parse(JSON.parse(localStorage.getItem(`items`)));
  var __json = JSON.stringify(items, null, 2);
  var _json = cleanJSONSchema(JSON.parse(__json));

  const json = JSON.parse(`[${_json}]`).sort((a, b) => {
    if (a.id < b.id) {
      return -1;
    }
    if (a.id > b.id) {
      return 1;
    }
    return 0;
  });

  let variables = [];
  for (var each of json) {
    const id = each.id;

    if (id) {
      const variable = `{% assign ${id} = ${
        settings?.removeSectionText ? "" : "section."
      }settings.${id} %}`;
      variables.push(variable);
    }
  }

  return variables.join("\n");
}

/*

TODO
All liquid variables generated with this app are between comments:

{% comment %}EZFY Variables Liquid [start]{% endcomment %}

{% comment %}EZFY Variables Liquid [end]{% endcomment %}
*/
export function mergeEzfyVariablesToCode(code) {
  if (!code) {
    throw new Error(`No "code" or "liquidVariables" parameters found.`);
  }

  let variables = "";
  const items = useStore.getState().items;
  const settings = useStore.getState().settings;
  const include = settings.includeVariables;

  if (include.includes("liquid")) {
    const liquid = convertToLiquidVariables(items, settings.variablesOrder);

    const hasEzfyLiquidVariables =
      /{%\s?\-?comment\s?\-?%}\s?ezfy\s?Variables\s?liquid\s?\[start\]{%/gim.test(
        code,
      );

    /* Found previous ezfy variables, delete it */
    if (hasEzfyLiquidVariables) {
      code = code.replaceAll(
        /({%\s?\-?comment\s?\-?%}\s?ezfy\s?Variables\s?liquid\s?\[start\]{%\s?\-?endcomment\s?\-?%})([.|\s|\S]*)({%\s?\-?comment\s?\-?%}\s?ezfy\s?Variables\s?liquid\s?\[end\]{%\s?\-?endcomment\s?\-?%})/gim,
        "",
      );
    }

    variables += liquid;
  }

  if (include.includes("css")) {
    const css = generateCSSVariables(items, settings.variablesOrder);

    const hasEzfyCSSVariables =
      /{%\s?\-?comment\s?\-?%}\s?ezfy\s?Variables\s?css\s?\[start\]{%/gim.test(
        code,
      );

    /* Found previous ezfy variables, delete it */
    if (hasEzfyCSSVariables) {
      code = code.replaceAll(
        /({%\s?\-?comment\s?\-?%}\s?ezfy\s?Variables\s?css\s?\[start\]{%\s?\-?endcomment\s?\-?%})([.|\s|\S]*)({%\s?\-?comment\s?\-?%}\s?ezfy\s?Variables\s?css\s?\[end\]{%\s?\-?endcomment\s?\-?%})/gim,
        "",
      );
    }

    variables += `\n\n${css}`;
  }

  if (include.includes("js")) {
    const js = generateJavascriptVariables(items, settings.variablesOrder);

    const hasEzfyJSVariables =
      /{%\s?\-?comment\s?\-?%}\s?ezfy\s?Variables\s?javascript\s?\[start\]{%/gim.test(
        code,
      );

    /* Found previous ezfy variables, delete it */
    if (hasEzfyJSVariables) {
      code = code.replaceAll(
        /({%\s?\-?comment\s?\-?%}\s?ezfy\s?Variables\s?javascript\s?\[start\]{%\s?\-?endcomment\s?\-?%})([.|\s|\S]*)({%\s?\-?comment\s?\-?%}\s?ezfy\s?Variables\s?javascript\s?\[end\]{%\s?\-?endcomment\s?\-?%})/gim,
        "",
      );
    }

    variables += `\n\n${js}`;
  }

  return `${variables}\n${code}`;
}

/* clean the JSON schema "settings" to remove all of the __id.

Returns a JSON.stringify-ed string, without the brackets.

*/
export const cleanJSONSchema = (_json) => {
  if (!_json) {
    throw new Error(`cleanJSONSchema - JSON doesn't exist`);
  }

  const json = cloneObject(_json).map((e, i) => {
    const index = i + 1;

    /* For all non "header" or "paragraphs" */
    if (e.type !== "header" && e.type !== "paragraph") {
      /* Set default values for 'label' and 'id' */

      if (!e.hasOwnProperty("label")) {
        e.label = `${e.type} ${index}`;
      }

      if (!e.hasOwnProperty("id")) {
        e.id = `${e.type}_${index}`;
      }

      delete e.content;
    }

    /* If checkbox has a default, convert it to boolean */
    if (e.type === "checkbox") {
      e.default = convertStringToBoolean(e.default);
    }

    /* Remove 'order' from the sub options **/
    if (e.hasOwnProperty("options")) {
      e.options = e.options.map((e) => {
        delete e.order;
        return e;
      });
    }

    /* Remove unnecessary keys */

    delete e.__id;
    delete e.order;

    /* TODO - if range && if unit is empty, remove unit */
    return e;
  });

  const _result = `${JSON.stringify(json, null, 2).replace(`[`, "")}`;
  const result = removeLastCharacter(_result, "]");

  return result;
};

export function cloneObject(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function extractTextBetween(text, start, end) {
  if (!start || !end) {
    throw new Error(`Please add a "start" and "end" parameter`);
  }

  return text.split(start)[1].split(end)[0];
}

/* Extract the {% schema %} JSON from code string. */
export function extractSchemaJSONFromCodeString(code = "") {
  if (!code.includes("{% schema %}")) {
    throw new Error("There is no 'schema' in the code string.");
  }

  const _json = extractTextBetween(code, `{% schema %}`, `{% endschema %}`);

  try {
    const json = JSON.parse(_json);

    if (!json.hasOwnProperty("name")) {
      throw new Error(`Broken imported section: no "name" attribute`);
    }
    return json;
  } catch (err) {
    throw new Error(`There is something wrong with the section code.`);
  }
}

export function convertStringToBoolean(string) {
  return string === "false" ? false : !!string;
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* Add an element to a specific index in an array */
export function addToIndex(arr, index, newItem) {
  return [...arr.slice(0, index), newItem, ...arr.slice(index)];
}

export function _extractTextBetween(text, start, end) {
  if (!start || !end) {
    throw new Error(`Please add a "start" and "end" parameter`);
  }

  return text.split(start)[1].split(end)[0];
}

export function replaceTextBetween(_text, start, end, newText) {
  if (!start || !end) {
    throw new Error(`Please add a "start" and "end" parameter`);
  }

  const text = _text;

  const result = `${text.split(start)[0]}${start}${newText}${end}${
    text.split(end)[1]
  }`;

  return result;
}

export const addObjectToIndex = (array, index, elementsToInsert) => {
  return [...array.slice(0, index), ...elementsToInsert, ...array.slice(index)];
};
