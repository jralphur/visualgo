import { ulid } from "ulid";
import type { CarouselProps } from "./Carousel";
import { CarouselPage } from "./CarouselPage";
import type { BreakpointSetting } from "./types";

export const CarouselPages = <T,>({
  pages,
  settings,
  render,
  pageRender,
  options,
  currentIndex,
}: Pick<CarouselProps<T>, "render" | "pageRender" | "options"> & {
  settings: BreakpointSetting;
  pages: T[][];
  currentIndex: number;
}) => {
  if (pageRender) {
    return pages.map((page) => pageRender(page));
  }
  const min = Math.max(0, currentIndex - 1);
  const max = Math.min(pages.length, currentIndex + 1);
  return pages.map((page, i) => (
    <CarouselPage
      key={ulid()}
      page={page}
      settings={settings}
      render={render}
      options={options}
      hidden={!(i >= min && i <= max)}
    />
  ));
};
