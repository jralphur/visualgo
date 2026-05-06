import { createContext } from "react";
import type { WidgetID } from "./Canvas";

type StateValues = {
  selected: WidgetID | null;
  targetable: boolean;
};

export const WidgetStateContext = createContext<StateValues | null>(null);
