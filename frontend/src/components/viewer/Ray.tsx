import type { FederatedPointerEvent, PointData } from "pixi.js";

export interface RayProps {
  id: string;
  start: PointData;
  end: PointData;
  selected: boolean;
  setSelected: (target: string) => void;
}

const Ray = ({ id, selected, setSelected, start, end }: RayProps) => {
  return (
    <pixiGraphics
      cursor="grab"
      onPointerDown={(e: FederatedPointerEvent) => {
        e.stopImmediatePropagation();
        setSelected(id);
      }}
      onPointerUp={(e: FederatedPointerEvent) => {
        e.stopImmediatePropagation();
      }}
      onPointerTap={(e: FederatedPointerEvent) => {
        e.stopImmediatePropagation();
        setSelected(id);
      }}
      draw={(g) => {
        g.clear();
        g.moveTo(start.x, start.y).lineTo(end.x, end.y);
        g.stroke({ width: 5, color: selected ? "yellow" : "#FFFFFF" });
      }}
    />
  );
};

export default Ray;
