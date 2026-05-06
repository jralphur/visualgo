import type { ArrayDataItem, NodeDataItem } from "@/components/viewer/Canvas";
import type { ArrayVariable, TreeNodeVariable } from "./Objects";

export const toArray = (a: ArrayDataItem): ArrayVariable =>
  a.values.map((v) => v[0]);

export const toTreeNode = (n: NodeDataItem): TreeNodeVariable => ({
  value: n.value,
  adjacent: n.adjacent.map((e) => e.to),
});
