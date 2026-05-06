import type { CSSProperties, ReactNode } from "react";
import type { BreakpointSetting, CarouselConfig, Orientation } from "./types";

interface CarouselPageProps<T> {
  page: T[];
  render: (item: T, index?: number) => ReactNode;
  settings: BreakpointSetting;
  options: Partial<CarouselConfig>;
  hidden: boolean;
}

export const CarouselPage = <T,>({
  page,
  settings,
  render,
  options,
  hidden,
}: CarouselPageProps<T>) => {
  const { gap } = settings;

  const { orientation = "horizontal" } = options;

  const style: { [keyof in Orientation]: CSSProperties } = {
    horizontal: {
      rowGap: gap,
    },
    vertical: {
      columnGap: gap,
    },
  };

  const className: { [keyof in Orientation]: string } = {
    horizontal: "flex",
    vertical: "flex-col",
  };

  const hiddenClass = hidden ? "hidden" : "";

  return (
    <div
      style={style[orientation]}
      className={`${className[orientation]} w-full ${hiddenClass}`}
    >
      {page.map((r) => render(r))}
    </div>
  );
};
