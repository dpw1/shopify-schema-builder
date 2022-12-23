import short from "short-uuid";

export const initialState = {
  activeSection: null,
  sectionName: "Test",
  count: 0,
};

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

export function convertToLiquidVariables(json) {
  let result = [];
  result.push(JSON.parse(json));

  let variables = [];
  for (var each of result[0]) {
    const id = each.id;

    if (id) {
      const variable = `{% assign ${id} = section.settings.${id} %}`;
      variables.push(variable);
    }
  }

  return variables.join("\n");
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
    console.error("Couldn't update textarea.");
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

/* This function converts a DOM item containing to JSON.  */
export const transformDOMIntoJSON = (each) => {
  let _json;
  const type = each.querySelector("select").value;
  const $attributes = each.querySelectorAll(`.FormItem-attr`);
  const $suboptions = each.querySelectorAll(`.FormItem-suboption`);

  _json = {
    type,
  };

  for (const attribute of $attributes) {
    const name = attribute
      .querySelector(`[data-label-name]`)
      .getAttribute(`data-label-name`);

    const __id = attribute
      .querySelector(`[data-label-name] + input`)
      .getAttribute("name")
      .split("_")[0];

    _json.__id = __id;
    let value = attribute.querySelector(`input`).value;

    /* Clean and format based on Shopify section rules for JSON */

    /* If there is no property 'info', ignore */
    if (name === "info" && (value === "" || !value)) {
      continue;
    }

    /* If there is no property 'default', ignore */
    if (name === "default" && (value === "" || !value)) {
      continue;
    }

    /* If there is no property 'default', ignore */
    if (name === "placeholder" && (value === "" || !value)) {
      continue;
    }

    /* type is 'richtext' and contains 'default', add <p> to it. */
    if (type === "richtext" && name === "default" && value !== "") {
      value = `<p>${value}</p>`;
    }

    /* type is 'textarea', replace all line breaks for liquid-friendly line breaks */
    if (type === "textarea" && name === "default" && value !== "") {
      value = value.replace(/\\n/g, `\n`);
    }

    /* type is "checkbox" and there is a "default", convert it to boolean */
    if (type === "checkbox" && name === "default" && value !== "") {
      value = value.toLowerCase() === "true" ? true : false;
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

    _json[name] = value;
  }

  /* type is 'select' or 'radio', process array of objects. */
  if (
    (type === "select" || type === "radio") &&
    $suboptions &&
    $suboptions.length >= 1
  ) {
    let _suboptions = [];

    for (const suboption of $suboptions) {
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

    _json["options"] = _suboptions;
  }

  return _json;
};

/* Converts all DOM items into JSON for the section's schema. */
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

/* This function will convert a typical Liquid schema into a EZFY Shopify Section Creator JSON-friendly items. */
export const convertSchemaJSONToItems = (json) => {
  return json.map((e) => {
    var object = { ...e };

    delete object.type;
    // delete object.options;

    return {
      id: short.generate(),
      type: e.type,

      duplicatedOptions: {
        ...object,
      },
      duplicatedSubOptions: { ...e.options },
    };
  });
};

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

/* Sets the current JSON edited via the DOM items. */
export const setJsonResult = (_json) => {
  let initialState = localStorage.getItem("json_initial_state");

  if (!initialState) {
    initialState = _json;
    localStorage.setItem("json_initial_state", initialState);
  }

  console.log("SETTING INITIAL STATE", initialState);

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

  /*
  TODO
  
  Scroll down the height of previous el 
  if last element, just scroll to bottom
  */
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

  // debugger;

  const result = {
    initialState: JSON.parse(json.initialState),
    previous: JSON.parse(json.previous),
    current: JSON.parse(json.current),
  };

  // console.log("getjs", result);
  return result;
};

export const resetJsonResult = (_) => {
  // localStorage.removeItem("json_initial_state");
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

    // debugger;

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

/* clean the schema JSON to remove all of the __id.*/
export const cleanJSONSchema = (_json) => {
  if (!_json) {
    throw new Error(`cleanJSONSchema - JSON doesn't exist`);
  }

  const json = _json.map((e) => {
    if (e.hasOwnProperty("__id")) {
      delete e.__id;
    }
    return e;
  });

  const _result = `${JSON.stringify(json, null, 2).replace(`[`, "")}`;
  const result = removeLastCharacter(_result, "]");

  return result;
};

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function addToIndex(arr, index, newItem) {
  return [...arr.slice(0, index), newItem, ...arr.slice(index)];
}

export async function generateJSONAndVariables() {
  return;
  const $generator = window.document.getElementById("generateJSON");

  if ($generator) {
    $generator.click();
    // await sleep(25);
    // $generator.click();
  }
}

export function _extractTextBetween(text, start, end) {
  if (!start || !end) {
    throw new Error(`Please add a "start" and "end" parameter`);
  }

  return text.split(start)[1].split(end)[0];
}

export function replaceTextBetween(text, start, end, newText) {
  if (!start || !end) {
    throw new Error(`Please add a "start" and "end" parameter`);
  }

  const result = `${text.split(start)[0]}${start}${newText}${end}${
    text.split(end)[1]
  }`;

  return result;
}
