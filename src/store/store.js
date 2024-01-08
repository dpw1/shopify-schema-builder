import create from "zustand";

const defaultSettings = {
  variablesOrder: "a-z", // a-z | z-a | default
  includeVariables: ["liquid", "css"], // 'liquid', 'css', 'js'
};

const getLocalStorage = (key) => JSON.parse(window.localStorage.getItem(key));
const setLocalStorage = (key, value) =>
  window.localStorage.setItem(key, JSON.stringify(value));

const useStore = create((set, get) => ({
  /* All the items from the section "ItemCopy.jsx".
  This is the "ugly" JSON with __id.


  This object contains:

  __id = random string
  id = string, type of element (text, number, etc)

  Advanced fields:
  InjectHTML = string, the CSS selector to inject that variable to

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

  /* Selected items (for cloning and mass delete)
   ======================================= */
  selectedItems: getLocalStorage("selectedItems")
    ? JSON.parse(getLocalStorage("selectedItems"))
    : [],
  addSelectedItem: (item) => {
    const items = get().selectedItems;

    const updated = [...items, item];

    set((_) => {
      setLocalStorage("selectedItems", JSON.stringify(updated));
      return {
        selectedItems: updated,
      };
    });
  },
  removeSelectedItem: (__id) => {
    const items = get().selectedItems;

    const updated = items.filter((e) => e !== __id);

    set((_) => {
      setLocalStorage("selectedItems", JSON.stringify(updated));
      return {
        selectedItems: updated,
      };
    });
  },
  removeAllSelectedItems: () => {
    set((_) => {
      setLocalStorage("selectedItems", JSON.stringify([]));
      return {
        selectedItems: [],
      };
    });
  },
  /* Global settings for the app 
   ======================================= */
  settings: getLocalStorage("settings") || defaultSettings,

  setSettings: (settings) => {
    if (!settings) {
      return;
    }

    localStorage.removeItem(`settings`);

    set((_) => {
      setLocalStorage("settings", settings);
      return {
        settings,
      };
    });
  },

  /* Update a specific settings. 

  Example: to update 'includeVariables', do this:

  setSetting({
	includeVariables: ['js', 'css']
  })
  */
  setSetting: (setting) => {
    if (!setting) {
      return;
    }

    var settings = get().settings;

    if (!settings.hasOwnProperty(Object.keys(setting))) {
      throw new Error("This property does not exist");
    }

    settings[Object.keys(setting)] = Object.values(setting)[0];

    set((_) => {
      setLocalStorage("settings", settings);
      return {
        settings,
      };
    });
  },

  updateSettings: (updated = null) => {
    if (!updated) {
      throw new Error("no value");
    }
    const _settings = get().settings;

    const settings = {
      ..._settings,
      ...updated,
    };

    set((_) => {
      setLocalStorage("settings", settings);
      return {
        settings,
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
