import type { FederatedPointerEvent, Graphics, PointData } from "pixi.js";
import { useCallback } from "react";
import type { SelectedWidget } from "./Canvas";
import { ModifableValue } from "./ModifableValue";

interface TreeNodeProps {
  id: string;
  value: number;
  position: PointData;
  lookingForRay: boolean;
  selected: boolean;
  setSelected: (target: SelectedWidget) => void;
  installRay: () => void;
  handleDelete: () => void;
  handleMove: () => void;
  onModifyValue: (s: string) => void;
  lookingForPointer: boolean;
  pointerSetter: () => void;
}

const TreeNodeWidget = ({
  id,
  value,
  position,
  selected,
  setSelected,
  handleMove,
  handleDelete,
  lookingForRay,
  installRay,
  onModifyValue,
  lookingForPointer,
  pointerSetter,
}: TreeNodeProps) => {
  const color = selected ? "green" : lookingForPointer ? "#efbaac" : "#0bafca";

  const callback = useCallback(
    (g: Graphics) => {
      g.clear();
      g.setFillStyle({ color });
      g.circle(0, 0, 24);
      g.fill();
    },
    [color],
  );

  const { x, y } = position;
  return (
    <pixiContainer
      x={x}
      y={y}
      sortableChildren
      cursor="grab"
      eventMode="static"
      onPointerDown={(e: FederatedPointerEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (e.button === 0) {
          setSelected({ widget: id });
          handleMove();
        }
      }}
      onPointerTap={(e: FederatedPointerEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (lookingForPointer) {
          pointerSetter();
        }
      }}
      onPointerUp={(e: FederatedPointerEvent) => {
        e.stopImmediatePropagation();

        if (lookingForRay) {
          installRay();
        } else if (lookingForPointer) {
          pointerSetter();
        }
      }}
      onPointerEnter={(e: FederatedPointerEvent) => {
        e.stopImmediatePropagation();
      }}
    >
      <pixiBitmapText
        x={48}
        y={0}
        text={"X"}
        style={{
          fontSize: 8,
          fontFamily: "sans-serif",
        }}
        onPointerTap={(_: FederatedPointerEvent) => handleDelete()}
      />
      <ModifableValue
        bg="#000000"
        value={`${value}`}
        selected={selected}
        setSelected={setSelected}
        commit={onModifyValue}
      />
      <pixiGraphics draw={callback} zIndex={3} cursor="grab" />
    </pixiContainer>
  );
};

export default TreeNodeWidget;
