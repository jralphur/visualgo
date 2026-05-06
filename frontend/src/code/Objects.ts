import type {
  ArrayData,
  EdgeID,
  EdgeType,
  EdgeWeight,
  EdgeWeights,
  GraphData,
  NodeData,
  PointerData,
  SetData,
  TreeNodeID,
} from "@/components/viewer/Canvas";

type Variable<V> = Pointer<V> | number | string | ArrayVariable;
// JavaScript objects to run the code
export interface Pointer<V> {
  pointTo: Variable<V>;
}

export interface TreeNodeVariable {
  value: string | number;
  // TODO: or maybe other TreeNodes
  adjacent: TreeNodeID[];
}

export class WeightedGraphVariable {
  graph: Map<TreeNodeID, Map<TreeNodeID, EdgeWeight>>;

  public constructor() {
    this.graph = new Map();
  }

  public add_directed_edge(
    from: TreeNodeID,
    to: TreeNodeID,
    weight: number,
  ): void {
    if (!this.graph.has(from)) {
      this.graph.set(from, new Map());
    }

    const adj = this.graph.get(from);
    adj?.set(to, weight);
  }

  public add_undirected_edge(
    from: TreeNodeID,
    to: TreeNodeID,
    weight: number,
  ): void {
    if (!this.graph.has(from)) {
      this.graph.set(from, new Map());
    }

    if (!this.graph.has(to)) {
      this.graph.set(to, new Map());
    }

    const adj = this.graph.get(from);
    adj?.set(from, weight);

    const otheradj = this.graph.get(to);
    otheradj?.set(to, weight);
  }
}

export class UnweightedGraphVariable {
  graph: Map<TreeNodeID, Set<TreeNodeID>>;

  public constructor() {
    this.graph = new Map();
  }

  public add_directed_edge(from: TreeNodeID, to: TreeNodeID): void {
    if (!this.graph.has(from)) {
      this.graph.set(from, new Set());
    }

    const adj = this.graph.get(from);
    adj?.add(to);
  }

  public add_undirected_edge(from: TreeNodeID, to: TreeNodeID): void {
    if (!this.graph.has(from)) {
      this.graph.set(from, new Set());
    }

    if (!this.graph.has(to)) {
      this.graph.set(to, new Set());
    }

    const adj = this.graph.get(from);
    adj?.add(to);

    const otheradj = this.graph.get(to);
    otheradj?.add(from);
  }
}

export type ArrayVariable =
  | Array<string | number>
  | Array<Array<string | number>>;

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
