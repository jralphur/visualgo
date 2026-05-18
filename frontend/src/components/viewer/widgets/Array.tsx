import type { LayoutContainer } from "@pixi/layout/components";
import type { PixiReactElementProps } from "@pixi/react";
import type { FederatedPointerEvent, PointData } from "pixi.js";
import "@pixi/layout/react";
import "@pixi/layout";
import { useRef } from "react";
import { ulid } from "ulid";
import type { SelectedWidget } from "../Canvas";
import type { BaseColors } from "../types";
import AddButton from "./AddButton";
import DeleteButton from "./DeleteButton";
import { ModifableValue } from "./ModifableValue";
import SubtractionButton from "./SubtractButton";

interface ArrayWidgetProps {
  id: string;
  values: [number | string][];
  position: PointData;
  selected: SelectedWidget | null;
  colorScheme: BaseColors;
  extend: (v: string | number) => void;
  contract: () => void;
  setSelected: (s: SelectedWidget) => void;
  handleDelete: () => void;
  handleMove: () => void;
  onTextCommit: (index: number, s: string) => void;
  lookingForPointer: boolean;
  pointerSetter: (index?: number) => void;
  removeAtIndex: (index: number) => void;
  direction: "row" | "column";
}

declare module "@pixi/react" {
  interface PixiElements {
    pixiLayoutContainer: PixiReactElementProps<typeof LayoutContainer>;
  }
}

export const ArrayWidget = ({
  id,
  values,
  position,
  selected,
  colorScheme,
  setSelected,
  handleDelete,
  handleMove,
  onTextCommit,
  lookingForPointer,
  pointerSetter,
  direction,
  extend,
  contract,
  removeAtIndex,
}: ArrayWidgetProps) => {
  const { x, y } = position;
  const array = useRef<LayoutContainer>(null);
  const [width, height] = [
    array.current?.width || 0,
    array.current?.height || 0,
  ];

  const {
    backgroundColor,
    textColor,
    activeColor,
    selectedColor,
    targetableColor,
    visitedColor,
  } = colorScheme;

  return (
    <pixiLayoutContainer
      x={x}
      y={y}
      ref={array}
      sortableChildren
      cursor="grab"
      eventMode="static"
      layout={{
        width: "intrinsic",
        height: "intrinsic",
        position: "absolute",
        flexDirection: direction,
        gap: 2,
        backgroundColor: lookingForPointer ? targetableColor : backgroundColor,
      }}
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
        if (e.button === 0 && !lookingForPointer) {
          setSelected({ widget: id, type: "array" });
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
      <DeleteButton
        x={0}
        y={0}
        onPointerTap={() => handleDelete()}
        px={8}
        backgroundColor={"red"}
      />

      {values.map((nums, i) => (
        <ModifableValue
          lookingForPointer={lookingForPointer}
          removeSelf={() => removeAtIndex(i)}
          pointerSetter={() => pointerSetter(i)}
          selected={selected?.key === i}
          key={`${id}-${i}-${nums[i]}`}
          value={`${nums[0]}`}
          colorScheme={colorScheme}
          onPointerTap={(e: FederatedPointerEvent) => {
            e.stopImmediatePropagation();
            setSelected({ widget: id, key: i, type: "array"});
          }}
        />
      ))}

      <AddButton
        x={width}
        y={0}
        onPointerTap={() => {
          const val = ulid();
          const next_index = values.length;
          extend(val);
          setSelected({ widget: id, key: next_index, type: "array"});
        }}
        px={8}
        backgroundColor="green"
      />

      <SubtractionButton
        x={width}
        y={height}
        onPointerTap={contract}
        px={8}
        backgroundColor="red"
      />
    </pixiLayoutContainer>
  );
};
