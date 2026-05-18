import type { PixiReactElementProps } from "@pixi/react";
import type { Input } from "@pixi/ui";
import type { FederatedPointerEvent, PointData } from "pixi.js";
import { useEffectEvent, useRef } from "react";
import type { SelectedWidget } from "../Canvas";
import type { BaseColors } from "../types";
import type { DirectedRayProps } from "./DirectedRay";
import { ModifableValue } from "./ModifableValue";
import type { RayProps } from "./Ray";

interface WeightedRayProps {
  id: string;
  start: PointData;
  end: PointData;
  value: number;
  colorScheme: BaseColors;
  onTextCommit: (s: string) => void;
  textSelected: boolean;
  setSelected: (target: SelectedWidget) => void;
  ray: React.ReactElement<DirectedRayProps> | React.ReactElement<RayProps>;
  tailHandler?: (e?: FederatedPointerEvent) => void;
  headHandler?: (e?: FederatedPointerEvent) => void;
}

declare module "@pixi/react" {
  interface PixiElements {
    pixiInput: PixiReactElementProps<typeof Input>;
  }
}

const WeightedRayProps = ({
  id,
  start,
  end,
  value,
  colorScheme,
  textSelected,
  setSelected,
  ray,
}: WeightedRayProps) => {
  const x = (start.x + end.x) / 2;
  const y = (start.y + end.y) / 2;

  return (
    <>
      <pixiContainer eventMode="static" x={x} y={y}>
        <ModifableValue
          colorScheme={colorScheme}
          value={`${value}`}
          onPointerTap={(e: FederatedPointerEvent) => {
            e.stopImmediatePropagation();
            setSelected({ widget: id, type: "ray" });
          }}
          selected={textSelected}
        />
      </pixiContainer>
      {ray}
    </>
  );
};

export default WeightedRayProps;
