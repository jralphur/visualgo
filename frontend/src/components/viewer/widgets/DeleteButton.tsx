import WidgetButton, { type WidgetButtonProps } from "../WidgetButton";

export interface DeleteButtonProps extends Omit<WidgetButtonProps, "content"> {}

const DeleteButton = ({
  px,
  x,
  y,
  onPointerTap,
  backgroundColor,
}: DeleteButtonProps) => (
  <WidgetButton
    x={x}
    y={y}
    px={px}
    onPointerTap={onPointerTap}
    backgroundColor={backgroundColor}
    content="X"
  />
);

export default DeleteButton;
