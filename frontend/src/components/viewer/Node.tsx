import type { FederatedPointerEvent, Graphics, PointData } from "pixi.js";
import { useCallback } from "react";

interface NodeProps {
  id: string;
  value: number;
  position: PointData;
  lookingForRay: boolean;
  selected: boolean;
  setSelected: (target: string) => void;
  installRay: (target: string) => void;
  handleDelete: (node: string) => void;
  handleMove: (id: string) => void;
}

const Node = ({
  id,
  value,
  position,
  selected,
  setSelected,
  handleMove,
  handleDelete,
  lookingForRay,
  installRay,
}: NodeProps) => {
  const callback = useCallback(
    (g: Graphics) => {
      g.clear();
      g.setFillStyle({ color: selected ? "green" : "blue" });
      g.circle(0, 0, 24);
      g.fill();
    },
    [selected],
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
          setSelected(id);
          handleMove(id);
        }
      }}
      onPointerUp={(e: FederatedPointerEvent) => {
        e.stopImmediatePropagation();
        if (lookingForRay) {
          installRay(id);
        }
      }}
      onPointerEnter={(e: FederatedPointerEvent) => {
        e.stopImmediatePropagation();
        console.log("hi");
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
        onPointerTap={(_: FederatedPointerEvent) => handleDelete(id)}
      />
      <pixiText
        text={value}
        style={{
          fill: "#000000",
          fontFamily: "sans-serif",
          fontSize: "24px",
        }}
        zIndex={4}
        anchor={0.5}
        cursor="grab"
        eventMode="none"
      />
      <pixiGraphics draw={callback} zIndex={3} cursor="grab" />
    </pixiContainer>
  );
};

export default Node;
