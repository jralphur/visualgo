import type { LayoutContainer } from "@pixi/layout/components";
import type { FederatedPointerEvent, PointData } from "pixi.js";
import { useRef } from "react";
import { ulid } from "ulid";
import type { SelectedWidget } from "../Canvas";
import type { BaseColors, SetID } from "../types";
import AddButton from "./AddButton";
import DeleteButton from "./DeleteButton";
import { ModifableValue } from "./ModifableValue";

interface SetWidgetProps {
  id: SetID;
  set: Set<string | number>;
  position: PointData;
  selected: SelectedWidget | null;
  colorScheme: BaseColors;
  handleDelete: () => void;
  setSelected: (s: SelectedWidget) => void;
  handleMove: () => void;
  onTextCommit: (oldValue: string | number, newValue: string | number) => void;
  removeKey: (key: string | number) => void;
  extend: (v: string | number) => void;
}

const SetWidget = ({
  id,
  set,
  position,
  selected,
  colorScheme,
  handleDelete,
  setSelected,
  handleMove,
  removeKey,
  onTextCommit,
  extend,
}: SetWidgetProps) => {
  const ref = useRef<LayoutContainer>(null);
  const {
    backgroundColor,
    textColor,
    activeColor,
    selectedColor,
    targetableColor,
    visitedColor,
  } = colorScheme;

  const { x, y } = position;
  const values = [...set.keys()]
    .map((v) => {
      if (typeof v === "number") {
        return v.toString();
      }

      return v;
    })
    .toSorted();

  const [width, height] = [ref.current?.width || 0, ref?.current?.height || 0];

  return (
    <pixiContainer
      ref={ref}
      x={x}
      y={y}
      cursor="grab"
      eventMode="static"
      layout={{
        width: "intrinsic",
        height: "intrinsic",
        position: "absolute",
        flexDirection: "row",
        backgroundColor: selected ? selectedColor : backgroundColor,
        gap: 2,
      }}
      onPointerTap={(e: FederatedPointerEvent) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      onPointerDown={(e: FederatedPointerEvent) => {
        e.stopPropagation();
        e.preventDefault();
        if (e.button === 0) {
          setSelected({ widget: id, type: "set" });
          handleMove();
        }
      }}
      onPointerUp={(e: FederatedPointerEvent) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      onPointerEnter={(e: FederatedPointerEvent) => {
        e.stopImmediatePropagation();
      }}
    >
      <DeleteButton
        x={width}
        y={height}
        onPointerTap={() => handleDelete()}
        px={8}
        backgroundColor={"red"}
      />

      <AddButton
        onPointerTap={() => {
          const filler = ulid();
          extend(filler);
          setSelected({ widget: id, type: "set", key: filler });
        }}
        x={width}
        y={0}
        px={8}
        backgroundColor={"green"}
      />

      <pixiBitmapText text={"{"} />

      {values.map((num) => (
        <ModifableValue
          key={`${id}:${num}`}
          selected={selected?.key === num}
          value={`${num}`}
          colorScheme={colorScheme}
          onPointerTap={(e: FederatedPointerEvent) => {
            e.stopImmediatePropagation();
            setSelected({ widget: id, type: "set", key: num });
          }}
          removeSelf={() => removeKey(num)}
        />
      ))}

      <pixiBitmapText text={"}"} />
    </pixiContainer>
  );
};

export default SetWidget;
