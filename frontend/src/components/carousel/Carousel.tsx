
import {
  type ReactNode,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import { CarouselControls } from "./CarouselControls";
import { CarouselPages } from "./CarouselPages";
import type {
  Breakpoints,
  CarouselConfig,
  pageRender,
  ResponsiveBreakpoints,
} from "./types";

const currentBreakpoint = (
  width: number | undefined,
): ResponsiveBreakpoints => {
  if (!width) {
    return "sm";
  }

  if (width > 1536) {
    return "2xl";
  }

  if (width > 1280) {
    return "xl";
  }

  if (width > 1024) {
    return "lg";
  }

  if (width > 768) {
    return "md";
  }

  return "sm";
};

const breakpoint_defaults: Breakpoints = {
  "2xl": {
    items_per_page: 5,
  },

  xl: {
    items_per_page: 5,
  },

  lg: {
    items_per_page: 4,
  },

  md: {
    items_per_page: 2,
  },

  sm: {
    items_per_page: 2,
  },
};

const makePages = <T,>(items: T[], items_per_page: number) => {
  const pages = [];

  for (let i = 0; i < items.length; i += items_per_page) {
    pages.push(items.slice(i, i + items_per_page));
  }

  return pages;
};

export interface CarouselProps<T> {
  content: T[];
  render: (item: T, index?: number) => ReactNode;
  pageRender?: pageRender<T>;
  options: Partial<CarouselConfig>;
}

export const Carousel = <T,>({
  content,
  options,
  render,
  pageRender,
}: CarouselProps<T>) => {
  const {
    loop = false,
    breakpoints,
    autoInterval = false,
    controls = "inline",
  } = options;
  const containerRef = useRef<HTMLDivElement>(null);

  const containerWidth = containerRef?.current?.offsetWidth;
  const brk = currentBreakpoint(containerWidth);

  const bp = breakpoints ?? breakpoint_defaults;
  const settings = bp[brk] ?? breakpoint_defaults[brk];

  const pages = makePages(content, settings.items_per_page);
  const [index, setIndex] = useState<number>(pages.length);

  const nextPage = useEffectEvent(() => {
    setIndex((index) => {
      if (loop) {
        return index + 1 === pages.length ? 0 : index + 1;
      } else {
        return index + 1 === pages.length ? pages.length - 1 : index + 1;
      }
    });
  });

  const previousPage = () => {
    if (loop) {
      return index - 1 < 0 ? pages.length - 1 : index - 1;
    } else {
      return index - 1 < 0 ? 0 : index - 1;
    }
  };

  const handleSetIndex = (index: number) => setIndex(index);

  // biome-ignore lint/correctness/useExhaustiveDependencies: useEffectEvent on nextPage
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (autoInterval) {
      interval = setInterval(() => nextPage());
    }
    return () => {
      clearInterval(interval);
    };
  }, [autoInterval]);

  const { leftPage, rightPage, selector } = CarouselControls({
    pageLength: pages.length,
    setIndex: handleSetIndex,
    previousPage,
    nextPage,
    currentIndex: index,
  });

  return (
    <div className="w-full" ref={containerRef}>
      <div>
        {controls === "inline" ? leftPage : null}
        <div>
          <CarouselPages
            render={render}
            pageRender={pageRender}
            settings={settings}
            pages={pages}
            options={options}
            currentIndex={index}
          />
        </div>
        {controls === "inline" ? rightPage : null}
      </div>
      {controls === "block" ? (
        <div>
          {leftPage}
          <div>{selector}</div>
          {rightPage}
        </div>
      ) : null}
    </div>
  );
};
