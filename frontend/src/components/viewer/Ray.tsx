import { type FederatedPointerEvent, Point, type PointData } from "pixi.js";
import type { SelectedWidget } from "./Canvas";
import type { BaseColors } from "./types";

export interface RayProps {
  id?: string;
  start: PointData;
  end: PointData;
  selected?: boolean;
  colorScheme: BaseColors;
  setSelected?: (target: SelectedWidget) => void;
  tailHandler?: (e?: FederatedPointerEvent) => void;
  headHandler?: (e?: FederatedPointerEvent) => void;
}

const Ray = ({
  id,
  selected,
  setSelected,
  start,
  end,
  colorScheme,
  tailHandler,
  headHandler,
}: RayProps) => {
  const vector = new Point(end.x - start.x, end.y - start.y);
  const magnitude = vector.magnitude();
  const end_grab = magnitude - Math.sqrt(5);
  const beg_grab = Math.sqrt(5);
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
      {/* move tail end of ray (pointing from) */}
      <pixiGraphics
        onPointerDown={(e: FederatedPointerEvent) => {
          tailHandler?.(e);
        }}
        draw={(g) => {
          g.clear();
          g.circle(
            start.x + vector.x * (beg_grab / magnitude),
            end.y + vector.y * (beg_grab / magnitude),
            15,
          ).fill("purple");
        }}
      />

      {/* move head end of ray (pointing to) */}
      <pixiGraphics
        onPointerDown={(e: FederatedPointerEvent) => {
          headHandler?.(e);
        }}
        draw={(g) => {
          g.clear();
          g.circle(
            start.x + vector.x * (end_grab / magnitude),
            end.y + vector.y * (end_grab / magnitude),
            15,
          ).fill("purple");
        }}
      />

      <pixiGraphics
        cursor="grab"
        onPointerDown={(e: FederatedPointerEvent) => {
          e.stopImmediatePropagation();
          if (id) setSelected?.({ widget: id });
        }}
        onPointerUp={(e: FederatedPointerEvent) => {
          e.stopImmediatePropagation();
        }}
        onPointerTap={(e: FederatedPointerEvent) => {
          e.stopImmediatePropagation();
          if (id) setSelected?.({ widget: id });
        }}
        draw={(g) => {
          g.clear();
          g.moveTo(start.x, start.y).lineTo(end.x, end.y);
          g.stroke({
            width: 5,
            color: selected ? selectedColor : backgroundColor,
          });
        }}
      />
    </pixiContainer>
  );
};

export default Ray;
