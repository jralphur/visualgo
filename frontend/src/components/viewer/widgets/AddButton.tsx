import WidgetButton, { type WidgetButtonProps } from "../WidgetButton";

export interface AddButtonProps extends Omit<WidgetButtonProps, "content"> {}

const AddButton = ({
  px,
  x,
  y,
  onPointerTap,
  backgroundColor,
}: AddButtonProps) => (
  <WidgetButton
    x={x}
    y={y}
    px={px}
    onPointerTap={onPointerTap}
    backgroundColor={backgroundColor}
    content="+"
  />
);

export default AddButton;
