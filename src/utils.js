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
  { id: "html" },
  { id: "article" },
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

export const updateJSONTextarea = (json) => {
  try {
    const $textarea = window.document.getElementById(`CodeTable-result`);
    $textarea.value = json;
  } catch (err) {
    console.error("Couldn't update textarea.");
  }
};

export const putFocusOnLastInputItem = (delay = 50) => {
  setTimeout(() => {
    const $lastItem = document.querySelector(
      `.Creator .item:last-of-type .FormItem-attr:nth-child(1) input`,
    );

    if (!$lastItem) {
      return;
    }

    $lastItem.focus();
  }, delay);
};

export const generateJSONSchema = () => {
  const $items = window.document.querySelectorAll(`.item`);
  let finalJSON = [];

  if (!$items) {
    return;
  }

  let _json = {};

  for (const each of $items) {
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

        const $inputs = suboption.querySelectorAll(`input`);

        [...$inputs].map(($input) => {
          const labelName = $input.getAttribute("label");
          const value = $input.value;

          console.log(`{ ${labelName}: ${value} }`);

          if (value === "") {
            _suboptionsJSON = delete _suboptionsJSON[labelName];
            return null;
          }

          _suboptionsJSON[labelName] = value;
        });

        if (typeof _suboptionsJSON !== "boolean") {
          _suboptions.push(_suboptionsJSON);
        }
      }

      _json["options"] = _suboptions;
    }

    finalJSON.push(_json);
  }

  const result = JSON.stringify(finalJSON, null, 2);

  return result;
};

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
