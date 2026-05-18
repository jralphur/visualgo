import type { Point } from "pixi.js";
import type {
  ArrayData,
  ArrayID,
  EdgeType,
  GraphData,
  GraphID,
  NodeData,
  PointerData,
  PointerID,
  SetData,
  SetID,
  TreeNodeID,
  WidgetID,
  WidgetTypes,
} from "./types";

export type GraphReducerAction =
  | GraphRemoveAction
  | GraphCreateAction
  | GraphAddNodeAction
  | GraphRemoveNodeAction;

type GraphCreateAction = {
  type: "create";
  id: GraphID;
};

type GraphRemoveAction = {
  type: "remove";
  id: GraphID;
};

type GraphAddNodeAction = {
  type: "add_node";
  graph_id: GraphID;
  node_id: TreeNodeID;
};

type GraphRemoveNodeAction = {
  type: "remove_node";
  graph_id: GraphID;
  node_id: TreeNodeID;
};

const filterRemoveGraph = (graphs: GraphData, target: GraphID): GraphData => {
  const next: GraphData = {};
  Object.entries(graphs).forEach((v) => {
    const [id, item] = v;

    if (id !== target) {
      next[id] = item;
    }
  });

  return next;
};

const graphsReducer = (
  graphs: GraphData,
  action: GraphReducerAction,
): GraphData => {
  switch (action.type) {
    case "remove":
      return filterRemoveGraph(graphs, action.id);
    case "create":
      return {
        ...graphs,
        [action.id]: {
          nodes: [],
          isDirected: false,
          isWeighted: false,
        },
      };
    case "add_node":
      return {
        ...graphs,
        [action.graph_id]: {
          ...graphs[action.graph_id],
          nodes: graphs[action.graph_id].nodes.concat(action.node_id),
        },
      };
    case "remove_node":
      return {
        ...graphs,
        [action.graph_id]: {
          ...graphs[action.graph_id],

          nodes: graphs[action.graph_id].nodes.filter(
            (n) => n !== action.node_id,
          ),
        },
      };
  }
};

export type NodeReducerAction =
  | NodeMoveAction
  | NodeDeleteAction
  | NodeModifyValueAction
  | NodeInstallRayAction
  | NodeInstallAction
  | NodeChangeGraphIDAction;

type NodeMoveAction = {
  type: "move";
  id: TreeNodeID;
  position: Point;
};

type NodeChangeGraphIDAction = {
  type: "change_graph";
  id: TreeNodeID;
  graph: GraphID;
};

type NodeDeleteAction = {
  type: "delete";
  node: TreeNodeID;
};

type NodeModifyValueAction = {
  type: "modify_value";
  node: TreeNodeID;
  value: number;
};

type NodeInstallAction = {
  type: "install_node";
  id: TreeNodeID;
  position: Point;
  value: number;
  graph: GraphID;
};

type NodeInstallRayAction = {
  type: "install_ray";
  edgeType: EdgeType;
  source: TreeNodeID;
  destination: TreeNodeID;
  weight?: number;
};

const filterNodeDelete = (nodes: NodeData, target: TreeNodeID) => {
  const next: NodeData = {};
  Object.entries(nodes).forEach((n) => {
    const [id, features] = n;

    if (id !== target) {
      next[id] = {
        ...features,
        value:
          features.value < nodes[target].value
            ? features.value
            : features.value - 1,
        adjacent: features.adjacent.filter((a) => a.to !== id),
      };
    }
  });

  return next;
};

const nodesReducer = (nodes: NodeData, action: NodeReducerAction): NodeData => {
  switch (action.type) {
    case "move":
      return {
        ...nodes,
        [action.id]: {
          ...nodes[action.id],
          position: action.position,
        },
      };
    case "delete":
      return filterNodeDelete(nodes, action.node);
    case "change_graph":
      return {
        ...nodes,
        [action.id]: {
          ...nodes[action.id],
          graph: action.graph,
        },
      };
    case "modify_value":
      return {
        ...nodes,
        [action.node]: {
          ...nodes[action.node],
          value: action.value,
        },
      };
    case "install_ray":
      if (action.edgeType === "directed") {
        return {
          ...nodes,
          [action.source]: {
            ...nodes[action.source],
            adjacent: nodes[action.source].adjacent.concat({
              to: action.destination,
              type: action.edgeType,
            }),
          },
        };
      } else {
        return {
          ...nodes,
          [action.source]: {
            ...nodes[action.source],
            adjacent: nodes[action.source].adjacent.concat({
              to: action.destination,
              type: action.edgeType,
            }),
            [action.destination]: {
              ...nodes[action.destination],
              adjacent: nodes[action.destination].adjacent.concat({
                to: action.source,
                type: action.edgeType,
              }),
            },
          },
        };
      }
    case "install_node":
      return {
        ...nodes,
        [action.id]: {
          value: action.value,
          position: action.position,
          adjacent: [],
          isRoot: false,
          graph: action.graph
        },
      };
  }
};

export type ArrayReducerAction =
  | ArrayInstallAction
  | ArrayDeleteAction
  | ArrayMoveAction
  | ArrayExtendAction
  | ArrayContractAction
  | ArrayRemoveAtIndex
  | ArrayEditValueAction;

type ArrayInstallAction = {
  type: "install";
  id: ArrayID;
  position: Point;
};

type ArrayDeleteAction = {
  type: "delete";
  id: ArrayID;
};

type ArrayMoveAction = {
  type: "move";
  id: ArrayID;
  position: Point;
};

type ArrayExtendAction = {
  type: "extend";
  id: ArrayID;
  value: number | string;
};

type ArrayContractAction = {
  type: "contract";
  id: ArrayID;
};

type ArrayEditValueAction = {
  type: "modify_value";
  id: ArrayID;
  index: number;
  value: number | string;
};

type ArrayRemoveAtIndex = {
  type: "remove_at_index";
  id: ArrayID;
  index: number;
};

const filterArrayDelete = (arrays: ArrayData, target: ArrayID) => {
  const next: ArrayData = {};
  Object.entries(arrays).forEach((n) => {
    const [id, features] = n;

    if (id !== target) {
      next[id] = features;
    }
  });

  return next;
};

const arrayReducer = (
  arrays: ArrayData,
  action: ArrayReducerAction,
): ArrayData => {
  switch (action.type) {
    case "install":
      return {
        ...arrays,
        [action.id]: {
          position: action.position,
          values: [],
        },
      };

    case "delete":
      return filterArrayDelete(arrays, action.id);
    case "move":
      return {
        ...arrays,
        [action.id]: {
          ...arrays[action.id],
          position: action.position,
        },
      };
    case "extend":
      return {
        ...arrays,
        [action.id]: {
          ...arrays[action.id],
          values: arrays[action.id].values.concat([0]),
          position: arrays[action.id].position,
        },
      };
    case "contract":
      return {
        ...arrays,
        [action.id]: {
          ...arrays[action.id],

          values: arrays[action.id].values.slice(
            0,
            arrays[action.id].values.length - 1,
          ),
          position: arrays[action.id].position,
        },
      };
    case "modify_value":
      return {
        ...arrays,
        [action.id]: {
          ...arrays[action.id],

          position: arrays[action.id].position,
          values: arrays[action.id].values.toSpliced(action.index, 1, [
            action.value,
          ]),
        },
      };
    case "remove_at_index":
      return {
        ...arrays,
        [action.id]: {
          ...arrays[action.id],
          values: arrays[action.id].values.toSpliced(action.index, 1),
        },
      };
  }
};

export type SetReducerAction =
  | SetInstallAction
  | SetRemoveAction
  | SetMoveAction
  | SetAddValueAction
  | SetRemoveValueAction
  | SetModifyValueAction;

type SetInstallAction = {
  type: "install";
  id: SetID;
  position: Point;
};

type SetRemoveAction = {
  type: "remove";
  id: SetID;
};

type SetMoveAction = {
  type: "move";
  id: SetID;
  position: Point;
};

type SetAddValueAction = {
  type: "add_value";
  id: SetID;
  value: number | string;
};

type SetRemoveValueAction = {
  type: "remove_value";
  id: SetID;
  value: number | string;
};

type SetModifyValueAction = {
  type: "modify_value";
  id: SetID;
  oldValue: string | number;
  newValue: string | number;
};

const filterSetDelete = (data: SetData, target: PointerID) => {
  const next: SetData = {};
  Object.entries(data).forEach((n) => {
    const [id, features] = n;

    if (id !== target) {
      next[id] = features;
    }
  });

  return next;
};

const setReducer = (data: SetData, action: SetReducerAction) => {
  switch (action.type) {
    case "install":
      return {
        ...data,
        [action.id]: {
          position: action.position,
          values: new Set<string | number>(),
        },
      };
    case "remove":
      return filterSetDelete(data, action.id);
    case "move":
      return {
        ...data,
        [action.id]: {
          ...data[action.id],
          position: action.position,
        },
      };
    case "add_value":
      return {
        ...data,
        [action.id]: {
          ...data[action.id],
          values: new Set<string | number>(
            [...data[action.id].values.keys()].concat(action.value),
          ),
        },
      };
    case "remove_value":
      return {
        ...data,
        [action.id]: {
          ...data[action.id],
          values: new Set<string | number>(
            [...data[action.id].values.values()].filter(
              (v) => v !== action.value,
            ),
          ),
        },
      };
    case "modify_value":
      return {
        ...data,
        [action.id]: {
          ...data[action.id],
          values: new Set<string | number>(
            [...data[action.id].values.keys()].map((v) => {
              if (v === action.oldValue) {
                return action.newValue;
              } else {
                return v;
              }
            }),
          ),
        },
      };
  }
};

export type PointerReducerAction =
  | PointerInstallAction
  | PointerDeleteAction
  | PointerModifyLabelAction
  | PointerModifyLabelPositionAction
  | PointerModifyRayPositionAction;

type PointerInstallAction = {
  type: "install";
  id: PointerID;
  label: string;
  position: Point;
  pointTo: {
    type: WidgetTypes;
    id: WidgetID;
  };
};

type PointerDeleteAction = {
  type: "delete";
  id: PointerID;
};

type PointerModifyLabelAction = {
  type: "modify_label_value";
  id: PointerID;
  label: string;
};

type PointerModifyLabelPositionAction = {
  type: "modify_label_position";
  id: PointerID;
  position: Point;
};

type PointerModifyRayPositionAction = {
  type: "modify_ray_position";
  id: PointerID;
  pointTo: {
    type: WidgetTypes;
    id: WidgetID;
  };
};

type Pointable = string | number | Array<string> | Array<number>;

const filterPointerDelete = (pointers: PointerData, target: PointerID) => {
  const next: PointerData = {};
  Object.entries(pointers).forEach((n) => {
    const [id, features] = n;

    if (id !== target) {
      next[id] = features;
    }
  });

  return next;
};

const pointerReducer = (
  pointers: PointerData,
  action: PointerReducerAction,
): PointerData => {
  switch (action.type) {
    case "install":
      return {
        ...pointers,
        [action.id]: {
          label: action.label,
          position: action.position,
          pointTo: action.pointTo,
        },
      };
    case "delete":
      return filterPointerDelete(pointers, action.id);
    case "modify_label_value":
      return {
        ...pointers,
        [action.id]: {
          ...pointers[action.id],
          label: action.label,
        },
      };
    case "modify_label_position":
      return {
        ...pointers,
        [action.id]: {
          ...pointers[action.id],
          position: action.position,
        },
      };
    case "modify_ray_position":
      return {
        ...pointers,
        [action.id]: {
          ...pointers[action.id],
          pointTo: action.pointTo,
        },
      };
  }
};

export {
  arrayReducer,
  graphsReducer,
  nodesReducer,
  pointerReducer,
  setReducer,
};
