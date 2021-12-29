import short from "short-uuid";

export const schema = [
  {
    id: "header",
  },
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

  if (!$textarea) {
    return;
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

    /* If this is a 'textarea', replace all line breaks for liquid-friendly line breaks */
    if (type === "textarea" && name === "default" && value !== "") {
      value = value.replace(/\\n/g, `\n`);
    }

    /* type is "checkbox" and there is a "default", convert it to boolean */
    if (type === "checkbox" && name === "default" && value !== "") {
      value = value.toLowerCase() === "true" ? true : false;
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

  /* If is of type 'select' or 'radio' it contains an array of objects. */
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
      duplicatedSubOptions: e.options,
    };
  });
};

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

/* Gets the current JSON being edited via the DOM items. */
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

    console.log("i orc -- ", /\[ezfyid_/gim.test(_updatedSection));

    const updatedSection = /\[ezfyid_/gim.test(_updatedSection)
      ? _updatedSection
      : replaceSectionSettingIdsOnFirstRender(_updatedSection);

    $result.value = updatedSection.trim();
  } catch (err) {
    console.log("xx error in schema: ", err);
  }
};

/* */
export const replaceSectionSettingIdsOnFirstRender = (section) => {
  const _json = getJsonResult();

  for (var each of _json.initialState) {
    if (each.hasOwnProperty("id")) {
      const __id = `${each.__id}`;

      console.log("i orc", each.id);

      section = section.replaceAll(
        `section.settings.${each.id}`,
        `[ezfyid_${__id}]section.settings.${each.id}[ezfyid_${__id}]`,
      );
    }
  }

  return section;
};

export const updateSectionSettings = (id, value) => {
  const $result = window.document.querySelector(`#sectionResult`);

  const result = $result.value.trim();

  if (result === "") {
    return;
  }

  const regex = new RegExp(`\\[ezfyid_${id}\\](.*)\\[ezfyid_${id}\\]`, "gmi");

  const updated = result.replaceAll(
    regex,
    `[ezfyid_${id}]${value}[ezfyid_${id}]`,
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

export const replaceIdThatWasUpdated = (section) => {
  const _json = getJsonResult();

  for (var each of _json.initialState) {
    const id = `${each.__id}`;

    section = section.replaceAll(``);
  }
  debugger;

  // const modifiedIds = getIdThatWasModified(_json.initialState, _json.current);

  // // debugger;
  // if (!modifiedIds) {
  //   return section;
  // }

  // for (var each of modifiedIds) {
  //   // const regex = new RegExp(`(${each.current})`, "g");
  //   // const hasBeenChanged = section.match(regex);

  //   // if (hasBeenChanged) {
  //   //   return section;
  //   // }

  //   console.log(
  //     `cookie | the item "${each.previous}" was renamed to "${each.current}".`,
  //   );

  //   section = section.replaceAll(each.previous, each.current).trim();
  // }

  // return section;
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
