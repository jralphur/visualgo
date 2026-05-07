import type { LayoutContainer } from "@pixi/layout/components";
import type { FederatedPointerEvent, PointData } from "pixi.js";
import { useRef } from "react";
import { ulid } from "ulid";
import AddButton from "./AddButton";
import type { SelectedWidget } from "./Canvas";
import DeleteButton from "./DeleteButton";
import { ModifableValue } from "./ModifableValue";
import type { SetID } from "./types";

interface SetWidgetProps {
  id: SetID;
  set: Set<string | number>;
  position: PointData;
  selected: SelectedWidget | null;
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
  handleDelete,
  setSelected,
  handleMove,
  removeKey,
  onTextCommit,
  extend,
}: SetWidgetProps) => {
  const ref = useRef<LayoutContainer>(null);

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
        backgroundColor: selected ? "#efbaac" : "#0bafca",
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
          setSelected({ widget: id });
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
        backgroundColor={"#FFFFFF"}
      />

      <AddButton
        onPointerTap={() => {
          const filler = ulid();
          extend(filler);
          setSelected({ widget: id, key: filler });
        }}
        x={width}
        y={0}
        px={8}
        backgroundColor={"#FFFFFF"}
      />

      <pixiBitmapText text={"{"} />

      {values.map((num) => (
        <ModifableValue
          key={`${id}:${num}`}
          selected={selected?.key === num}
          commit={(s: string) => onTextCommit(num, s)}
          value={`${num}`}
          bg="#FFFFFF"
          padding={[2, 2, 2, 2]}
          onPointerTap={(e: FederatedPointerEvent) => {
            e.stopImmediatePropagation();
            setSelected({ widget: id, key: num });
          }}
          removeSelf={() => removeKey(num)}
          cleanOnFocus
        />
      ))}

      <pixiBitmapText text={"}"} />
    </pixiContainer>
  );
};

export default SetWidget;
