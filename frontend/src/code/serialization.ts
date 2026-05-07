import type {
  ArrayData,
  ArrayDataItem,
  EdgeWeights,
  GraphDataItem,
  NodeData,
  NodeDataItem,
  PointerData,
  SetDataItem,
  WidgetID,
  WidgetTypes,
} from "@/components/viewer/Canvas";
import {
  type ArrayVariable,
  type TreeNodeVariable,
  UnweightedGraph,
  WeightedGraph,
} from "./Objects";

export const toArray = (a: ArrayDataItem): ArrayVariable =>
  a.values.map((v) => v[0]);

export const toTreeNode = (n: NodeDataItem): TreeNodeVariable => ({
  value: n.value,
  adjacent: n.adjacent.map((e) => e.to),
});

// export const serialize_graph = (
//   graph: GraphDataItem,
//   nodeData: NodeData,
//   edgeWeights: EdgeWeights,
// ) => {
//   const { nodes } = graph;

//   const nodeItems = nodes.map((n) => nodeData[n]);
// };

export const serializeWeightedGraph = (
  graph: GraphDataItem,
  nodeData: NodeData,
  edgeWeights: EdgeWeights,
): WeightedGraph => {
  const res = new WeightedGraph();
  const { nodes } = graph;

  const nodeItems = nodes.map((n) => ({ id: n, data: nodeData[n] }));

  for (let i = 0; i < nodeItems.length; i++) {
    const n = nodeItems[i];
    for (let j = 0; j < n.data.adjacent.length; j++) {
      res.addDirectedEdge(
        n.id,
        n.data.adjacent[j].to,
        edgeWeights[`${n.id}-${n.data.adjacent[j].to}`],
      );
    }

    res.setNodeValue(n.id, n.data.value);
  }

  return res;
};

export const serializedUnweightedGraph = (
  graph: GraphDataItem,
  nodeData: NodeData,
) => {
  const res = new UnweightedGraph();
  const { nodes } = graph;

  const nodeItems = nodes.map((n) => ({ id: n, data: nodeData[n] }));

  for (let i = 0; i < nodeItems.length; i++) {
    const n = nodeItems[i];
    for (let j = 0; j < n.data.adjacent.length; j++) {
      res.addDirectedEdge(n.id, n.data.adjacent[j].to);
    }
    res.setNodeValue(n.id, n.data.value);
  }

  return res;
};

const valueFromCollection = (
  type: WidgetTypes,
  id: WidgetID,
  arrays: ArrayData,
  nodes: NodeData,
  pointers: PointerData,

  arrayIndex?: number,
) => {
  switch (type) {
    case "array":
      return arrayIndex ? toArray(arrays[id])[arrayIndex] : toArray(arrays[id]);
    case "node":
      return toTreeNode(nodes[id]).value;
    case "pointer":
      return valueFromCollection(
        pointers[id].pointTo.type,
        pointers[id].pointTo.id,
        arrays,
        nodes,
        pointers,
        arrayIndex,
      );
    case "text":
      return "text";
  }
};

export const serializePointer = (
  type: WidgetTypes,
  id: WidgetID,
  arrays: ArrayData,
  nodes: NodeData,
  pointers: PointerData,

  arrayIndex?: number,
) => {
  return {
    pointTo: valueFromCollection(type, id, arrays, nodes, pointers, arrayIndex),
  };
};

export const serializeSet = (set: SetDataItem) => {
  return new Set(set.values);
};

export const serializeArray = (array: ArrayDataItem) => {
  return array.values;
};
