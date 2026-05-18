import { type MouseEventHandler, useReducer, useRef, useState } from "react";
import Canvas, { type SelectedWidget } from "./viewer/Canvas";
import Code from "./viewer/Code";
import ModifyWidgetPanel from "./viewer/ModifyWidgetPanel";
import { arrayReducer, graphsReducer, nodesReducer, pointerReducer, setReducer } from "./viewer/reducer";
import type { EdgeWeights, WidgetDataItem, WidgetID } from "./viewer/types";

type MouseDownDividerState = {
  e: React.MouseEvent<HTMLDivElement, MouseEvent>;
  offsetLeft: number;
  offsetTop: number;
  firstWidth: number;
  secondWidth: number;
};

export default function Viewer() {
  const [mouseDownDivider, setMouseDownDivider] =
    useState<MouseDownDividerState | null>(null);

  const [canvasWidthPercentage, setCanvasWidthPercentage] = useState(0.75);
  const divider = useRef<HTMLDivElement | null>(null);
  const container = useRef<HTMLElement | null>(null);
  const canvas = useRef<HTMLDivElement | null>(null);
  const panel = useRef<HTMLDivElement | null>(null);
  const [nodes, nodeDispatch] = useReducer(nodesReducer, {});
  const [arrays, arrayDispatch] = useReducer(arrayReducer, {});
  const [sets, setDispatch] = useReducer(setReducer, {});
  const [pointers, pointerDispatch] = useReducer(
    pointerReducer,
    {},
  );
  const [edgeWeights, setEdgeWeights] = useState<EdgeWeights>({});

  const [selectedWidget, setSelectedWidget] = useState<SelectedWidget | null>(null)
  const [graphs, graphDispatch] = useReducer(graphsReducer, {});
  
  const initDrag: MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();

    if (divider.current && canvas.current && panel.current) {
      setMouseDownDivider({
        e,
        offsetLeft: divider.current.offsetLeft,
        offsetTop: divider.current.offsetTop,
        firstWidth: canvas.current.offsetWidth,
        secondWidth: panel.current.offsetWidth,
      });
    }
  };

  const dragDivider: MouseEventHandler<HTMLElement> = (e) => {
    e.preventDefault();
    if (mouseDownDivider && canvas.current && container.current) {
      const delta = {
        x: e.clientX - mouseDownDivider.e.clientX,
      };

      delta.x = Math.min(
        Math.max(delta.x, -mouseDownDivider.firstWidth),
        mouseDownDivider.secondWidth,
      );
      setCanvasWidthPercentage(
        (mouseDownDivider.firstWidth + delta.x) / container.current.offsetWidth,
      );
    }
  };

  const stopDrag: typeof dragDivider = (_) => {
    setMouseDownDivider(null);
  };

  const dataFromWidget = (): WidgetDataItem | undefined => {
    switch (selectedWidget?.type) {
      case "array":
        return arrays[selectedWidget.widget]
      case "node":
        return nodes[selectedWidget.widget]
      case "set":
        return sets[selectedWidget.widget]
      case "pointer":
        return pointers[selectedWidget.widget]
      case "ray":
        // TODO: work on rays
        return undefined;
    }

    return undefined
  }

  const handleWidgetEdit = (w: WidgetDataItem) => {

  }

  const selectedWidgetItem = dataFromWidget();

  return (
    <main
      ref={container}
      onMouseMove={dragDivider}
      onMouseUp={stopDrag}
      className="flex h-full bg-green-300"
    >
      <div
        className="flex items-center justify-center bg-blue-400"
        style={{
          width: `${canvasWidthPercentage * 100}%`,
        }}
        ref={canvas}
      >
        <Canvas 
          graphs={graphs}
          nodes={nodes}
          arrays={arrays}
          sets={sets}
          pointers={pointers}
          edgeWeights={edgeWeights}
          nodeDispatch={nodeDispatch}
          arrayDispatch={arrayDispatch}
          setDispatch={setDispatch}
          pointerDispatch={pointerDispatch}
          graphDispatch={graphDispatch}
          setEdgeWeights={setEdgeWeights}
          readonly={false} 
          selected={selectedWidget}
          setSelected={setSelectedWidget}
        />
      </div>

      {/** biome-ignore lint/a11y/useSemanticElements: vertical splitter */}
      <div
        className="w-1 cursor-ew-resize after:block after:w-px"
        role="separator"
        draggable="true"
        aria-valuenow={75}
        aria-orientation="vertical"
        tabIndex={0}
        onMouseDown={initDrag}
        ref={divider}
      ></div>

      <div
        className={`z-50 flex h-full transform bg-gray-900 shadow-2xl transition-transform duration-300 ease-in-out`}
        style={{
          width: `${(1 - canvasWidthPercentage) * 100}%`,
        }}
        ref={panel}
      >
        <div className="flex w-fit grow flex-col items-stretch gap-3 px-2 py-4">
          <Code />
        </div>
        <div>
          <ModifyWidgetPanel widget={selectedWidgetItem}/>
        </div>
      </div>
    </main>
  );
}
