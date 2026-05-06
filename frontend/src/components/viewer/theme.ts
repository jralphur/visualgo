import { createContext } from "react";

const colors = {
  selected: "green",
  targetable: "#efbaac",
};

export const ThemeContext = createContext(colors);
