export type pageRender<T> = (items: T[]) => React.ReactNode;

export type CSSUnits =
  | "%"
  | "cm"
  | "mm"
  | "Q"
  | "in"
  | "pc"
  | "pt"
  | "px"
  | "em"
  | "rem"
  | "vw"
  | "vh"
  | "ex"
  | "ch";
export type ResponsiveBreakpoints = "sm" | "md" | "lg" | "xl" | "2xl";
export type CSSValue = `${number}${CSSUnits}` | "vmax" | "vmin";
export type BreakpointSetting = {
  items_per_page: number;
  gap?: CSSValue;
};
export type Breakpoints = {
  [key in ResponsiveBreakpoints]: BreakpointSetting;
};

export type BreakpointsArgs = Partial<Breakpoints>;

export type Orientation = "horizontal" | "vertical";
export type ControlsOptions = "inline" | "hidden" | "block";

export interface CarouselConfig {
  loop: boolean;
  autoInterval: number;
  breakpoints: BreakpointsArgs;
  orientation: Orientation;
  controls: ControlsOptions;
}
