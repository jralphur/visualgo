import type { PixiReactElementProps } from "@pixi/react";
import type { Input } from "@pixi/ui";
import type { FederatedPointerEvent, PointData } from "pixi.js";
import { useEffect, useEffectEvent, useRef } from "react";
import { Signal } from "typed-signals";
import type { DirectedRayProps } from "./DirectedRay";
import type { RayProps } from "./Ray";

interface WeightedRayProps {
  id: string;
  start: PointData;
  end: PointData;
  value: number;
  onTextCommit: (s: string) => void;
  textSelected: boolean;
  setSelected: (target: string) => void;
  ray: React.ReactElement<DirectedRayProps> | React.ReactElement<RayProps>;
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

  useEffect(() => {
    if (input.current) {
      input.current.onChange = new Signal<(s: string) => void>();
      input.current.onChange.connect((s: string) => {
        const n = s.endsWith(".") ? s.concat("0") : s;
        const p = parseFloat(n);
        if (!Number.isNaN(p)) {
          commit(s);
        }
      });
    }

    return () => {
      input.current?.onChange.disconnectAll();
    };
  }, []);

  return (
    <>
      <pixiContainer eventMode="static" x={x} y={y}>
        <pixiInput
          bg={`${textSelected ? "#FFFFFFFF" : "#FFFFFF00"}`}
          value={`${value}`}
          onPointerTap={(e: FederatedPointerEvent) => {
            e.stopImmediatePropagation();
            setSelected(id);
          }}
          padding={[2, 2, 2, 2]}
          cleanOnFocus
        />
      </pixiContainer>
      {ray}
    </>
  );
};

export default WeightedRayProps;
