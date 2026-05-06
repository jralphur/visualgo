import type { FederatedPointerEvent } from "pixi.js";

export interface WidgetButtonProps {
  px: number;
  onPointerTap: (e?: FederatedPointerEvent) => void;
  x: number;
  y: number;
  content: string;
  backgroundColor: string;
}

const WidgetButton = ({
  px,
  onPointerTap,
  x,
  y,
  content,
  backgroundColor,
}: WidgetButtonProps) => (
  <pixiContainer
    interactive
    x={x}
    y={y}
    eventMode="static"
    layout={{
      padding: "4",
      width: "auto",
      backgroundColor,
      position: "absolute",
    }}
    onPointerTap={onPointerTap}
  >
    <pixiBitmapText
      text={content}
      style={{
        fontSize: px,
      }}
    />
  </pixiContainer>
);

export default WidgetButton;
