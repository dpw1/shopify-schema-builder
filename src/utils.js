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

    _json = {
      type,
    };

    for (const attr of $attributes) {
      const name = attr
        .querySelector(`[data-label-name]`)
        .getAttribute(`data-label-name`);

      const value = attr.querySelector(`input`).value;

      _json[name] = value;
    }

    finalJSON.push(_json);
  }

  const result = JSON.stringify(finalJSON, null, 2);

  return result;
};

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
