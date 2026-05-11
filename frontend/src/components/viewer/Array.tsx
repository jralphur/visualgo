import type { LayoutContainer } from "@pixi/layout/components";
import type { PixiReactElementProps } from "@pixi/react";
import type { FederatedPointerEvent, PointData } from "pixi.js";
import "@pixi/layout/react";
import "@pixi/layout";
import { useRef } from "react";
import { ulid } from "ulid";
import AddButton from "./AddButton";
import type { SelectedWidget } from "./Canvas";
import DeleteButton from "./DeleteButton";
import { ModifableValue } from "./ModifableValue";
import SubtractionButton from "./SubtractButton";
import type { BaseColors } from "./types";

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
          commit={(s: string) => onTextCommit(i, s)}
          key={`${id}-${i}-${nums[i]}`}
          value={`${nums[0]}`}
          padding={[2, 2, 2, 2]}
          cleanOnFocus
          colorScheme={colorScheme}
          onPointerTap={(e: FederatedPointerEvent) => {
            e.stopImmediatePropagation();
            setSelected({ widget: id, key: i });
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
          setSelected({ widget: id, key: next_index });
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
