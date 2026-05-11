import type { Point } from "pixi.js";

export interface BaseColors {
  backgroundColor: string;
  // mouseover color
  highlightColor: string;
  textColor: string;
  // not selecting, during play
  activeColor: string;
  // selection on editing or currently being accessed by play
  selectedColor: string;
  visitedColor: string;
  // for ray installation
  targetableColor: string;
}

export type SceneSchema = {
  canvas: {
    width: number;
    height: number;
    title: string;
    author: string;
    date_created: Date;
    last_modified: Date;
  };
  graph: GraphData;
  nodes: NodeData;
  pointers: PointerData;
  edges: EdgeWeights;
  arrays: ArrayData;
  sets: SetData;
};

export type ColorScheme = {
  defaultNode: string;
  defaultArray: string;
  defaultSet: string;
  defaultEdge: string;
  defaultPointer: string;
  selected: string;
  active: string;
  visited: string;
  unvisited: string;
  targetable: string;
  untargetrable: string;
};

export type WidgetID = string;
export type TreeNodeID = WidgetID;
export type ArrayID = WidgetID;
export type PointerID = WidgetID;
export type EdgeID = `${TreeNodeID}-${TreeNodeID}`;
export type GraphID = WidgetID;
export type SetID = WidgetID;

export type WidgetTypes = "array" | "text" | "node" | "pointer";
export type EdgeType = "directed" | "undirected";
export type EdgeWeight = number;

export type EdgeData = {
  to: TreeNodeID;
  type: EdgeType;
};

export interface EdgeWeights {
  [id: EdgeID]: EdgeWeight;
}

export interface WidgetDataItem {
  // position of the object (top left origin for most widgets)
  position: Point;
}

interface WidgetCollectionData {
  [id: WidgetID]: WidgetDataItem;
}

export interface NodeDataItem extends WidgetDataItem {
  value: number;
  position: Point;
  isRoot: boolean;
  adjacent: EdgeData[];
  graph: GraphID;
}

export interface NodeData extends WidgetCollectionData {
  [node: TreeNodeID]: NodeDataItem;
}

export interface GraphData {
  [graph: GraphID]: GraphDataItem;
}

export interface GraphDataItem {
  nodes: TreeNodeID[];
  isWeighted: boolean;
  isDirected: boolean;
  color: string;
}

export interface ArrayDataItem extends WidgetDataItem {
  values: [number | string][];
  position: Point;
}

export interface ArrayData extends WidgetCollectionData {
  [array: ArrayID]: ArrayDataItem;
}

export interface SetDataItem extends WidgetDataItem {
  values: Set<number | string>;
  position: Point;
}

export interface SetData extends WidgetCollectionData {
  [set: SetID]: SetDataItem;
}

export interface PointerDataItem extends WidgetDataItem {
  label: string;
  position: Point;
  pointTo: {
    type: WidgetTypes;
    id: WidgetID;
    arrayIndex?: number;
  };
}

export interface PointerData extends WidgetCollectionData {
  [pointer: PointerID]: PointerDataItem;
}
