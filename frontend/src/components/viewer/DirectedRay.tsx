import type { PointData } from "pixi.js";
import Ray from "./Ray";

export interface DirectedRayProps {
  id: string;
  start: PointData;
  end: PointData;
  selected: boolean;
  setSelected: (target: string) => void;
}

const DirectedRay = ({
  id,
  start,
  end,
  selected,
  setSelected,
}: DirectedRayProps) => {
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
        }}
      />

      <Ray
        id={id}
        selected={selected}
        setSelected={setSelected}
        start={start}
        end={end}
      />
    </pixiContainer>
  );
};

export default DirectedRay;
