import type { LayoutContainer } from "@pixi/layout/components";
import type { FederatedPointerEvent } from "pixi.js";
import { useRef } from "react";
import type { BaseColors } from "../types";
import DeleteButton from "./DeleteButton";

interface ModifableValueProps  {
  value: string | number
  selected: boolean;
  colorScheme: BaseColors;
  lookingForPointer?: boolean;
  pointerSetter?: () => void;
  removeSelf?: () => void;
  onPointerTap?: (e: FederatedPointerEvent) => void;
}

export const ModifableValue = ({
  value,
  selected,
  colorScheme,
  lookingForPointer,
  pointerSetter,
  onPointerTap,
  removeSelf,
}: ModifableValueProps) => {
  const catchPointer = lookingForPointer ?? false;
  const container = useRef<LayoutContainer>(null);
 

  const [width, _] = [
    container.current?.width || 0,
    container.current?.height || 0,
  ];

  return (
    <pixiLayoutContainer
      ref={container}
      layout={{
        backgroundColor: catchPointer
          ? colorScheme.targetableColor
          : colorScheme.backgroundColor,
      }}
      onPointerTap={onPointerTap}
      onPointerUp={() => {
        if (catchPointer) {
          pointerSetter?.();
        }
      }}
    > 
      <pixiBitmapText text={value} />
      {selected && removeSelf && (
        <DeleteButton
          px={2}
          onPointerTap={removeSelf}
          x={width}
          y={0}
          backgroundColor="#FF0000"
        />
      )}


    </pixiLayoutContainer>
  );
};
