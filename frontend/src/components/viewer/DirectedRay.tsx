import type { FederatedPointerEvent, PointData } from "pixi.js";
import type { SelectedWidget } from "./Canvas";
import Ray from "./Ray";
import type { BaseColors } from "./types";

export interface DirectedRayProps {
  id: string;
  start: PointData;
  end: PointData;
  selected: boolean;
  colorScheme: BaseColors;
  setSelected: (target: SelectedWidget) => void;
  tailHandler?: (e?: FederatedPointerEvent) => void;
  headHandler?: (e?: FederatedPointerEvent) => void;

  type: "edge" | "pointer";
}

const DirectedRay = ({
  id,
  start,
  end,
  selected,
  setSelected,
  colorScheme,
}: DirectedRayProps) => {
  const {
    backgroundColor,
    textColor,
    activeColor,
    selectedColor,
    targetableColor,
    visitedColor,
  } = colorScheme;

  return (
    <pixiContainer>
      <pixiGraphics
        draw={(g) => {
          g.clear();
          g.regularPoly(
            end.x,
            end.y,
            20,
            3,
            Math.PI / 2 + Math.atan2(end.y - start.y, end.x - start.x),
          );
          g.fill(backgroundColor);
        }}
      />

      <Ray
        id={id}
        colorScheme={colorScheme}
        selected={selected}
        setSelected={setSelected}
        start={start}
        end={end}
      />
    </pixiContainer>
  );
};

export default DirectedRay;
