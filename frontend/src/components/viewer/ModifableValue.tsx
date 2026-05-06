import type { LayoutContainer } from "@pixi/layout/components";
import type { PixiReactElementProps } from "@pixi/react";
import type { Input } from "@pixi/ui";
import { useEffect, useRef } from "react";
import { Signal } from "typed-signals";
import type { SelectedWidget } from "./Canvas";
import DeleteButton from "./DeleteButton";

interface ModifableValueProps extends PixiReactElementProps<typeof Input> {
  selected: boolean;
  commit: (s: string) => void;
  setSelected?: (s: SelectedWidget) => void;
  lookingForPointer?: boolean;
  pointerSetter?: () => void;
  removeSelf?: () => void;
}

export const ModifableValue = ({
  value,
  selected,
  commit,
  setSelected,
  lookingForPointer,
  pointerSetter,
  onPointerTap,
  removeSelf,
  ...props
}: ModifableValueProps) => {
  const input = useRef<Input>(null);
  const catchPointer = lookingForPointer ?? false;
  const container = useRef<LayoutContainer>(null);

  useEffect(() => {
    if (input.current) {
      input.current.onChange = new Signal<(s: string) => void>();
      input.current.onChange.connect((s: string) => {
        const n = s.endsWith(".") ? s.concat("0") : s;
        const p = parseFloat(n);
        if (!Number.isNaN(p)) {
          commit(s);
        }
      });
    }

    return () => {
      input.current?.onChange.disconnectAll();
    };
  }, [commit]);

  const [width, _] = [
    container.current?.width || 0,
    container.current?.height || 0,
  ];

  return (
    <pixiLayoutContainer
      ref={container}
      layout={{
        backgroundColor: catchPointer ? "#e78f77" : "#0bafca",
      }}
      onPointerTap={onPointerTap}
      onPointerUp={() => {
        if (catchPointer) {
          pointerSetter?.();
        }
      }}
    >
      {selected && removeSelf && (
        <DeleteButton
          px={2}
          onPointerTap={removeSelf}
          x={width}
          y={0}
          backgroundColor="#FF0000"
        />
      )}
      <pixiInput {...props} />
    </pixiLayoutContainer>
  );
};
