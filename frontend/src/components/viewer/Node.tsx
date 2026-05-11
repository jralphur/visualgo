import type { FederatedPointerEvent, Graphics, PointData } from "pixi.js";
import { useCallback } from "react";
import type { SelectedWidget } from "./Canvas";
import { ModifableValue } from "./ModifableValue";
import type { BaseColors, ColorScheme } from "./types";

interface NodeProps {
  id: string;
  value: number | string;
  position: PointData;
  selected: boolean;
  colorScheme: BaseColors;
  setSelected: (target: SelectedWidget) => void;
  handleDelete: () => void;
  handleMove: () => void;
  onModifyValue: (s: string) => void;
  lookingForPointer: boolean;
  pointerSetter: () => void;
}

const Node = ({
  id,
  value,
  position,
  selected,
  colorScheme,
  setSelected,
  handleMove,
  handleDelete,
  onModifyValue,
  lookingForPointer,
  pointerSetter,
}: NodeProps) => {
  const color = selected
    ? colorScheme.selectedColor
    : lookingForPointer
      ? colorScheme.targetableColor
      : colorScheme.backgroundColor;
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
      onPointerTap={(e: FederatedPointerEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (lookingForPointer) {
          pointerSetter();
        }
      }}
      onPointerDown={(e: FederatedPointerEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (e.button === 0) {
          setSelected({ widget: id });
          handleMove();
        }
      }}
      onPointerUp={(e: FederatedPointerEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (lookingForPointer) {
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
        colorScheme={colorScheme}
        value={`${value}`}
        selected={selected}
        setSelected={setSelected}
        commit={onModifyValue}
      />
      <pixiGraphics draw={callback} zIndex={3} cursor="grab" />
    </pixiContainer>
  );
};

export default Node;
