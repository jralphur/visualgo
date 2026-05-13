import { ulid } from "ulid";

interface WidgetPanelProps {
  widgets: {
    component: React.ReactNode;
    onClick: () => void;
    descriptiveText: string;
  }[];
}

export const WidgetPanel = ({ widgets }: WidgetPanelProps) => {
  return (
    <div className="flex flex-wrap absolute z-40 bg-white top-0">
      {widgets.map(({ component, onClick, descriptiveText }) => (
        <button
          key={ulid()}
          title={descriptiveText}
          onClick={onClick}
          type="button"
        >
          {component}
        </button>
      ))}
    </div>
  );
};
