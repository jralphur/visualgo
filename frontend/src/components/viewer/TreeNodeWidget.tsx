import { Circle, Rectangle, type FederatedPointerEvent, type Graphics, type PointData } from "pixi.js";
import { useCallback } from "react";
import type { SelectedWidget } from "./Canvas";
import { ModifableValue } from "./ModifableValue";
import type { BaseColors } from "./types";

interface TreeNodeProps {
  id: string;
  value: number;
  position: PointData;
  lookingForRay: boolean;
  selected: boolean;
  colorScheme: BaseColors;
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
  colorScheme,
  setSelected,
  handleMove,
  handleDelete,
  lookingForRay,
  installRay,
  onModifyValue,
  lookingForPointer,
  pointerSetter,
}: TreeNodeProps) => {
  const {
    backgroundColor,
    textColor,
    activeColor,
    selectedColor,
    targetableColor,
    visitedColor,
  } = colorScheme;

  const color = selected
    ? selectedColor
    : lookingForPointer
      ? targetableColor
      : backgroundColor;

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
  const hitArea = new Circle(0, 0, 24)
  const xHit = new Rectangle(48, 0, 64, 64)
  return (
    <>
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
      zIndex={30}
      
    >
      {/* <ModifableValue
        colorScheme={colorScheme}
        value={`${value}`}
        selected={selected}
        setSelected={setSelected}
        commit={onModifyValue}
      /> */}
      <pixiBitmapText
          x={0}
          y={0}
          text={"X"}
          eventMode="static"
          // hitArea={xHit}
          style={{
            fontSize: 64,
            fontFamily: "sans-serif",
            fill: "white"
          }}
          onPointerEnter={() => console.log('e')}
          onPointerTap={(_: FederatedPointerEvent) => {
            console.log('tap')
            handleDelete()
          }}
  
      />

      <pixiGraphics draw={callback} cursor="grab" />
    </pixiContainer>
    </>
  );
};

export default TreeNodeWidget;
