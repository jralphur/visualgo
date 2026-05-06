import type { PixiReactElementProps } from "@pixi/react";
import type { Input } from "@pixi/ui";
import type { FederatedPointerEvent, PointData } from "pixi.js";
import { useEffectEvent, useRef } from "react";
import type { SelectedWidget } from "./Canvas";
import type { DirectedRayProps } from "./DirectedRay";
import { ModifableValue } from "./ModifableValue";
import type { RayProps } from "./Ray";

interface WeightedRayProps {
  id: string;
  start: PointData;
  end: PointData;
  value: number;
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
  textSelected,
  setSelected,
  onTextCommit,
  ray,
}: WeightedRayProps) => {
  const input = useRef<Input>(null);
  const x = (start.x + end.x) / 2;
  const y = (start.y + end.y) / 2;

  const commit = useEffectEvent((s: string) => {
    onTextCommit(s);
  });

  return (
    <>
      <pixiContainer eventMode="static" x={x} y={y}>
        <ModifableValue
          bg={`${textSelected ? "#FFFFFFFF" : "#FFFFFF00"}`}
          value={`${value}`}
          ref={input}
          onPointerTap={(e: FederatedPointerEvent) => {
            e.stopImmediatePropagation();
            setSelected({ widget: id });
          }}
          padding={[2, 2, 2, 2]}
          cleanOnFocus
          commit={commit}
          selected={textSelected}
          setSelected={setSelected}
        />
      </pixiContainer>
      {ray}
    </>
  );
};

export default WeightedRayProps;
