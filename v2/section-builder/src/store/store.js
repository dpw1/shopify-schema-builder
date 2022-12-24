import create from "zustand";

const getLocalStorage = (key) => JSON.parse(window.localStorage.getItem(key));
const setLocalStorage = (key, value) =>
  window.localStorage.setItem(key, JSON.stringify(value));

const useStore = create((set, get) => ({
  /* All the items from the section "Item.jsx".
  This is the "ugly" JSON with __id.
  ======================================= */
  items: getLocalStorage("items") || [],
  addItem: (item) => {
    const items = get().items;

    const updated = [...items, item];

    set((_) => {
      setLocalStorage("items", updated);
      return {
        items: updated,
      };
    });
  },
  addItems: (_items) => {
    const items = get().items;

    const updated = [...items, ..._items];

    set((_) => {
      setLocalStorage("items", updated);
      return {
        items: updated,
      };
    });
  },
  updateItems: (_items) => {
    const items = [..._items];

    set((_) => {
      setLocalStorage("items", items);
      return {
        items,
      };
    });
  },
  removeItems: () => {
    set((_) => {
      setLocalStorage("items", []);
      return {
        items: [],
      };
    });
  },
  /* This will overwrite all items */
  setItems: (items) => {
    set((_) => {
      setLocalStorage("items", items);
      return {
        items,
      };
    });
  },

  /* the JSON that is generated to use in the section's schema. 
  This is the "clean" JSON to use in the Shopify section.
  ======================================= */
  jsonResult: getLocalStorage("jsonResult") || [],

  /* Variables that are generated from the JSON schema. 
  ======================================= */
  variablesResult: getLocalStorage("variablesResult") || null,
  updateVariablesResult: (variables) => {
    set((_) => {
      setLocalStorage("variablesResult", variables);
      return {
        variablesResult: variables,
      };
    });
  },

  /* The values of each input. For instance: ID, Label, Info, Default, etc. 
  ======================================= */
  values: getLocalStorage("values") || [],
  addValues: (_values) => {
    const values = get().values;

    set((_) => {
      setLocalStorage("values", _values);
      return {
        values: {
          ...values,
          ..._values,
        },
      };
    });
  },

  /* The raw section code that the user wants to modify.
  ======================================= */
  section: getLocalStorage("section") || "",
  addSection: (_section) => {
    set((_) => {
      setLocalStorage("section", _section);
      return {
        section: _section,
      };
    });
  },

  /* Adds "section." to the variables. 
	true => section.settings.my_variable
	false => settings.my_variable
  ======================================= */
  sectionText: getLocalStorage("section-text"),
  setSectionText: (value) => {
    set((_) => {
      setLocalStorage("section-text", value);
      return {
        sectionText: value,
      };
    });
  },

  /* Global JSON is the "ugly" JSON containing the __id. All available schemas are found here.
  It's used for programatic purposes and not used on the actual Shopify section.

  This one is mostly used for the UI. There is redundancy with the "items".
  ======================================= */
  globalJson: getLocalStorage("globalJson")
    ? JSON.parse(getLocalStorage("globalJson"))
    : [],
  setGlobalJson: (json) => {
    set((_) => {
      setLocalStorage("globalJson", JSON.stringify(json));
      return {
        globalJson: json,
      };
    });
  },
}));

export default useStore;
