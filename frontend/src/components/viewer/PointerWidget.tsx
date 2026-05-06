import type { Point } from "pixi.js";
import type { ArrayVariable } from "@/code/Objects";
import type { PointerID, SelectedWidget } from "./Canvas";
import DirectedRay from "./DirectedRay";
import Node from "./Node";

interface PointerProps {
  nodePosition: Point;
  rayEnd: Point;
  hideRay: boolean;
  id: PointerID;
  label: string;
  selected: boolean;
  value: string | number | ArrayVariable;
  setSelected: (target: SelectedWidget) => void;
  handleDelete: () => void;
  handleMoveLabel: () => void;
  handleMoveRay: () => void;
  onModifyValue: (s: string) => void;
  lookingForPointer: boolean;
  pointerSetter: () => void;
}

export const PointerWidget = ({
  id,
  label,
  nodePosition,
  rayEnd,
  hideRay,
  setSelected,
  selected,
  handleDelete,
  handleMoveLabel,
  handleMoveRay,
  onModifyValue,
  lookingForPointer,
  pointerSetter,
}: PointerProps) => {
  const relX = nodePosition.x - rayEnd.x;
  const relY = nodePosition.y - rayEnd.y;
  return (
    <pixiContainer x={nodePosition.x} y={nodePosition.y}>
      <Node
        id={id}
        value={label}
        position={nodePosition}
        selected={selected}
        setSelected={setSelected}
        onModifyValue={onModifyValue}
        handleDelete={handleDelete}
        handleMove={handleMoveLabel}
        lookingForPointer={lookingForPointer}
        pointerSetter={pointerSetter}
      />
      {!hideRay && (
        <DirectedRay
          id={id}
          start={{ x: 0, y: 0 }}
          end={{ x: relX, y: relY }}
          selected={selected}
          setSelected={setSelected}
          headHandler={handleMoveRay}
          type="pointer"
        />
      )}
    </pixiContainer>
  );
};
