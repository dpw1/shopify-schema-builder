import create from "zustand";

const getLocalStorage = (key) => JSON.parse(window.localStorage.getItem(key));
const setLocalStorage = (key, value) =>
  window.localStorage.setItem(key, JSON.stringify(value));

const useStore = create((set, get) => ({
  /* All the items from the section "Item.jsx".
  This is the "ugly" JSON with __id.
  ======================================= */
  items: getLocalStorage("items") ? JSON.parse(getLocalStorage("items")) : [],
  addItem: (item) => {
    const items = get().items;

    const updated = [...items, item];

    set((_) => {
      setLocalStorage("items", JSON.stringify(updated));
      return {
        items: updated,
      };
    });
  },
  addItems: (_items) => {
    const items = get().items;

    const updated = [...items, ..._items];

    set((_) => {
      setLocalStorage("items", JSON.stringify(updated));
      return {
        items: updated,
      };
    });
  },
  updateItems: (_items) => {
    const items = [..._items];

    set((_) => {
      setLocalStorage("items", JSON.stringify(items));
      return {
        items,
      };
    });
  },
  updateItem: (item) => {
    const items = get().items;

    const updated = items.map((e) => {
      if (e.__id === item.__id) {
        e = item;
      }

      return e;
    });

    set((_) => {
      setLocalStorage("items", JSON.stringify(updated));
      return {
        items: updated,
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
  removeItem: (__id) => {
    const items = get().items;

    const updated = items.filter((e) => e.__id !== __id);

    set((_) => {
      setLocalStorage("items", JSON.stringify(updated));
      return {
        items: updated,
      };
    });
  },
  /* Overwrite all items with new json */
  setItems: (items) => {
    // debugger;
    console.log("setting items...", items);

    localStorage.removeItem(`items`);

    set((_) => {
      setLocalStorage("items", JSON.stringify(items));
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

  /* 
  Values are used to store the input name and value of each input.
  Example:
  
  
 The input "id" will be stored like this: 9D1E6NZjgUiUiQxrAUDVN2_id: "my_id"
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
}));

export default useStore;
