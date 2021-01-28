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
