import create from "zustand";

const useStore = create((set, get) => ({
  products: "ok",
  variables: "",
  updateVariables: (variables) => {
    set({
      variables,
    });
  },
}));

export default useStore;
