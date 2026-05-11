import { createContext } from "react";
import type { ColorScheme } from "./types";

// TODO pretty theme
const defaultColorScheme = {
  background: "white",
  text: "black",
  defaultNode: "green",
  defaultArray: "green",
  defaultSet: "green",
  defaultEdge: "green",
  defaultPointer: "green",
  selected: "green",
  active: "red",
  visited: "red",
  unvisited: "green",
  targetable: "#efbaac",
  untargetrable: "red",
};

export const ThemeContext = createContext<ColorScheme>(defaultColorScheme);
