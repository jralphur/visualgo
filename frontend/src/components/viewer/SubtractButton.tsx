import WidgetButton, { type WidgetButtonProps } from "./WidgetButton";

export interface SubtractionButtonProps
  extends Omit<WidgetButtonProps, "content"> {}

const SubtractionButton = ({
  px,
  x,
  y,
  onPointerTap,
  backgroundColor,
}: SubtractionButtonProps) => (
  <WidgetButton
    x={x}
    y={y}
    px={px}
    onPointerTap={onPointerTap}
    backgroundColor={backgroundColor}
    content="-"
  />
);

export default SubtractionButton;
