import type { FederatedPointerEvent, PointData } from "pixi.js";
import type { SelectedWidget } from "../Canvas";
import type { BaseColors } from "../types";
import DirectedRay from "./DirectedRay";
import Ray from "./Ray";
import WeightedRay from "./WeightedRay";

interface GraphEdgeProps {
  id: string;
  start: PointData;
  end: PointData;
  colorScheme: BaseColors;
  onTextCommit?: (s: string) => void;
  textSelected?: boolean;
  selected: boolean;
  setSelected: (target: SelectedWidget) => void;
  weight?: number;
  type: "directed" | "undirected";
  tailHandler?: (e?: FederatedPointerEvent) => void;
  headHandler?: (e?: FederatedPointerEvent) => void;
}

export const GraphEdge = ({
  id,
  start,
  end,
  colorScheme,
  onTextCommit,
  textSelected,
  selected,
  setSelected,
  weight,
  type,
}: GraphEdgeProps) => {
  const ray =
    type === "directed" ? (
      <DirectedRay
        id={id}
        colorScheme={colorScheme}
        start={start}
        end={end}
        selected={selected}
        setSelected={setSelected}
        type="edge"
      />
    ) : (
      <Ray
        id={id}
        start={start}
        end={end}
        colorScheme={colorScheme}
        selected={selected}
        setSelected={setSelected}
      />
    );

  if (weight && onTextCommit && textSelected) {
    return (
      <WeightedRay
        id={id}
        colorScheme={colorScheme}
        start={start}
        end={end}
        value={weight}
        onTextCommit={onTextCommit}
        setSelected={setSelected}
        textSelected={textSelected}
        ray={ray}
      />
    );
  }

  return ray;
};
