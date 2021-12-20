import create from "zustand";

const getLocalStorage = (key) => JSON.parse(window.localStorage.getItem(key));
const setLocalStorage = (key, value) =>
  window.localStorage.setItem(key, JSON.stringify(value));

const useStore = create((set, get) => ({
  /* All the items that are part of the schema's JSON. 
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

  /* the JSON that is generated to use in the section's schema. 
  ======================================= */
  jsonResult: getLocalStorage("jsonResult") || [],
  updateJsonResult: (_json) => {
    set((_) => {
      setLocalStorage("jsonResult", _json);
      return {
        jsonResult: _json,
      };
    });
  },

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
}));

export default useStore;
