import type { TreeNodeID } from "@/components/viewer/types";
import type { ArrayVariable, UnweightedGraph, WeightedGraph } from "./Objects";

export type Index = number | string | TreeNodeID;

export abstract class Traceable<T> {
  variable: T;
  visited: Set<Index>;
  selected: boolean;

  public constructor(v: T) {
    this.variable = v;
    this.visited = new Set();
    this.selected = false;
  }

  public select() {
    this.selected = true;
  }

  public deselect() {
    this.selected = false;
  }

  public abstract isVisited(index: Index): boolean;
  public abstract isVisiting(index: Index): boolean;
  public abstract visit(
    index: Index,
  ): number | string | (string | number)[] | undefined;
}

export class TraceableArray implements Traceable<ArrayVariable> {
  variable: ArrayVariable;
  visited: Set<Index>;
  selected: boolean;
  currentIndex: number;

  public constructor(v: ArrayVariable) {
    this.variable = v;
    this.visited = new Set();
    this.selected = false;
    this.currentIndex = 0;
  }

  public select() {
    this.selected = true;
  }

  public deselect() {
    this.selected = false;
  }

  public isVisited(index: number): boolean {
    return this.visited.has(index);
  }

  public isVisiting(index: number): boolean {
    return this.currentIndex === index;
  }

  public visit(index: number) {
    this.currentIndex = index;

    return this.variable[index];
  }
}

export class TraceableSet implements Traceable<Set<number | string>> {
  variable: Set<string | number>;
  visited: Set<string | number>;
  selected: boolean;
  currentKey: string | number | null;

  public constructor(s: Set<string | number>) {
    this.variable = s;
    this.visited = new Set();
    this.selected = false;
    this.currentKey = null;
  }

  public select() {
    this.selected = true;
  }

  public deselect() {
    this.selected = false;
  }

  public isVisited(index: number | string): boolean {
    return this.visited.has(index);
  }
  public isVisiting(index: Index): boolean {
    return this.currentKey === index;
  }
  public visit(index: Index): number | string | (string | number)[] {
    this.currentKey = index;

    return this.currentKey;
  }
}

export class TraceableUnweightedGraph implements Traceable<UnweightedGraph> {
  variable: UnweightedGraph;
  visited: Set<Index>;
  selected: boolean;
  currentNode: TreeNodeID | null;

  public constructor(g: UnweightedGraph) {
    this.variable = g;
    this.visited = new Set();
    this.selected = false;
    this.currentNode = null;
  }

  public select() {
    this.selected = true;
  }

  public deselect() {
    this.selected = false;
  }

  public isVisited(index: TreeNodeID): boolean {
    return this.visited.has(index);
  }

  public isVisiting(index: TreeNodeID): boolean {
    return this.currentNode === index;
  }
  public visit(index: TreeNodeID): number | string | undefined {
    this.currentNode = index;

    return this.variable.getNodeValue(index);
  }
}

export class TraceableWeightedGraph implements Traceable<WeightedGraph> {
  variable: WeightedGraph;
  visited: Set<Index>;
  selected: boolean;
  currentNode: TreeNodeID | null;

  public constructor(g: WeightedGraph) {
    this.variable = g;
    this.visited = new Set();
    this.selected = false;
    this.currentNode = null;
  }

  public select() {
    this.selected = true;
  }

  public deselect() {
    this.selected = false;
  }

  public isVisited(index: TreeNodeID): boolean {
    return this.visited.has(index);
  }

  public isVisiting(index: TreeNodeID): boolean {
    return this.currentNode === index;
  }
  public visit(index: TreeNodeID): number | string | undefined {
    this.currentNode = index;

    return this.variable.getNodeValue(index);
  }
}
