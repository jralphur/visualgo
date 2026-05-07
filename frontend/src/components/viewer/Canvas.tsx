import { LayoutContainer } from "@pixi/layout/components";
import { Application, extend, type PixiReactElementProps } from "@pixi/react";
import { Input } from "@pixi/ui";
import { ArrowBigLeft, Circle, LineChart, Square } from "lucide-react";
import {
  BitmapText,
  Container,
  FederatedPointerEvent,
  Graphics,
  Point,
  type PointData,
  Rectangle,
  Text,
  Triangle,
} from "pixi.js";
import {
  useEffect,
  useEffectEvent,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { monotonicFactory } from "ulid";
import { toArray, toTreeNode } from "@/code/serialization";
import { ArrayWidget } from "./Array";
import { GraphEdge } from "./GraphEdge";
import { PointerWidget } from "./PointerWidget";
import Ray from "./Ray";
import {
  arrayReducer,
  graphsReducer,
  nodesReducer,
  pointerReducer,
  setReducer,
} from "./reducer";
import SetWidget from "./SetWidget";
import TreeNodeWidget from "./TreeNodeWidget";
import { ThemeContext } from "./theme";
import type {
  ArrayID,
  EdgeID,
  EdgeType,
  EdgeWeights,
  PointerID,
  SceneSchema,
  SetID,
  TreeNodeID,
  WidgetID,
  WidgetTypes,
} from "./types";
import { WidgetPanel } from "./WidgetPanel";

declare module "@pixi/react" {
  interface PixiElements {
    pixiInput: PixiReactElementProps<typeof Input>;
  }
}

const ulid = monotonicFactory();

extend({
  Container,
  Graphics,
  FederatedPointerEvent,
  Text,
  Triangle,
  Input,
  BitmapText,
  LayoutContainer,
});

const generate_edge_id = (from: TreeNodeID, to: TreeNodeID): EdgeID => {
  return `${from}-${to}`;
};

const nextChar = (current: string) => {
  const i = (parseInt(current, 36) + 1) % 36;
  return (i * 10 + i).toString(36);
};

const next_label = (current: string): string => {
  if (current.length === 0) {
    return current;
  }
  const last = current[current.length - 1];
  const inc = nextChar(last);
  const left = current.substring(0, current.length - 1);

  if (inc === "a") {
    return next_label(left) + inc;
  }

  return left + inc;
};

interface CanvasProps {
  initialScene: SceneSchema;
  readonly: boolean;
}

export interface SelectedWidget {
  widget: WidgetID;
  key?: number | string;
}

const bound = new Rectangle(0, 0, 1400, 900);
export default function Canvas({ initialScene, readonly }: CanvasProps) {
  const {
    canvas,
    graph: initialGraph,
    nodes: initialNodes,
    pointers: initialPointers,
    edges: initialEdges,
    arrays: initialArrays,
    sets: initialSets,
  } = initialScene;
  const clickArea = useRef<Container | null>(null);
  const localPos = useRef<Point | null>(null);

  if (localPos.current === null) {
    localPos.current = new Point(0, 0);
  }

  const [nextNodeValue, setNextNodeValue] = useState(1);
  const [nodes, nodeDispatch] = useReducer(nodesReducer, initialNodes);
  const [arrays, arrayDispatch] = useReducer(arrayReducer, initialArrays);
  const [sets, setDispatch] = useReducer(setReducer, initialSets);
  const [pointers, pointerDispatch] = useReducer(
    pointerReducer,
    initialPointers,
  );
  const [graphs, graphDispatch] = useReducer(graphsReducer, initialGraph);

  const [selected, setSelected] = useState<SelectedWidget | null>(null);
  const [handleCanvasTapAction, setHandleCanvasTapAction] = useState<
    (point: Point) => void
  >((_) => {});
  const [edgeType, setEdgeType] = useState<EdgeType>("directed");
  // TODO: reuse newRayPosition this when moving a ray?
  const [newRayPosition, setNewRayPosition] = useState<{
    start: PointData;
    end: PointData;
  } | null>(null);
  const [newPointerLabelPosition, setNewPointerLabelPosition] =
    useState<Point | null>(null);

  const [moveTarget, setMoveTarget] = useState<WidgetID | null>(null);
  const [moveOperation, setMoveOperation] = useState<
    (e: FederatedPointerEvent, p: Point, id: WidgetID) => void
  >((_) => {});
  const [edgeWeights, setEdgeWeights] = useState<EdgeWeights>(initialEdges);
  const [pointerLabel, setNextPointerLabel] = useState<string>("a");

  // TODO: moving a pointer ray from one widget to another
  //       Idea: reuse newRayPosition, dont render the original ray
  //             on selected

  const [movingPointerRay, setMovingPointerRay] = useState<PointerID | null>(
    null,
  );

  const pointFromCollection = (
    w: WidgetTypes,
    id: WidgetID,
  ): Point | undefined => {
    switch (w) {
      case "array":
        return arrays[id].position;
      case "node":
        return nodes[id].position;
      case "pointer":
        return pointers[id].position;
      case "text":
        return new Point(0, 0);
    }
  };

  // TODO: handle cyclic loops and bounds check on arrays
  const valueFromCollection = (
    w: WidgetTypes,
    id: WidgetID,
    arrayIndex?: number,
  ) => {
    switch (w) {
      case "array":
        return arrayIndex
          ? toArray(arrays[id])[arrayIndex]
          : toArray(arrays[id]);
      case "node":
        return toTreeNode(nodes[id]).value;
      case "pointer":
        return valueFromCollection(
          pointers[id].pointTo.type,
          pointers[id].pointTo.id,
        );
      case "text":
        return "text";
    }
  };

  const initializePointer = (p: Point) => {
    setNewPointerLabelPosition(p);
    setNewRayPosition({ start: p, end: p });
    // setHandleCanvasTapAction((p: Point) => {
    //   installPointer(ulid(), pointerLabel, getNewPointerPosition(), () => p);
    //   setNextPointerLabel(next_label(pointerLabel));
    // });
  };

  const getNewPointerPosition = (): Point => {
    return newPointerLabelPosition ? newPointerLabelPosition : new Point(0, 0);
  };

  const installPointer = (
    id: PointerID,
    label: string,
    nodePosition: Point,
    pointTo: {
      type: WidgetTypes;
      id: WidgetID;
    },
  ) => {
    if (movingPointerRay) {
      movePointerRayPosition(movingPointerRay, pointTo);
    } else {
      pointerDispatch({
        type: "install",
        id,
        position: new Point(nodePosition.x, nodePosition.y),
        pointTo,
        label,
      });
      setNextPointerLabel(next_label(pointerLabel));
    }
  };

  const handleInstallPointer = (pointTo: {
    type: WidgetTypes;
    id: WidgetID;
    arrayIndex?: number;
  }) => {
    if (newPointerLabelPosition) {
      installPointer(ulid(), pointerLabel, getNewPointerPosition(), pointTo);
    } else if (movingPointerRay) {
      movePointerRayPosition(movingPointerRay, pointTo);
    }
  };

  const deletePointer = (pointer: PointerID) => {
    pointerDispatch({
      type: "delete",
      id: pointer,
    });
  };

  const changePointerLabel = (id: PointerID, label: string) => {
    pointerDispatch({
      type: "modify_label_value",
      id,
      label,
    });
  };

  const movePointerRayPosition = (
    id: PointerID,
    pointTo: {
      type: WidgetTypes;
      id: WidgetID;
    },
  ) => {
    pointerDispatch({
      type: "modify_ray_position",
      pointTo,
      id,
    });
  };

  const movePointerLabelPosition = (id: PointerID, nodePosition: Point) => {
    pointerDispatch({
      type: "modify_label_position",
      id,
      position: nodePosition,
    });
  };

  const createEdges = useMemo(() => {
    const edges: {
      id: EdgeID;
      from: PointData;
      to: PointData;
      type: EdgeType;
      weight?: number;
    }[] = [];
    const generated_ids = new Set();

    Object.entries(nodes).forEach(([id, data]) => {
      const { adjacent, position } = data;

      for (let j = 0; j < adjacent.length; j++) {
        const a = adjacent[j];
        const { to, type } = a;
        const i = generate_edge_id(id, to);
        if (!generated_ids.has(i)) {
          edges.push({
            id: i,
            type,
            from: position,
            to: nodes[to].position,
            weight: edgeWeights[i],
          });

          generated_ids.add(i);
        }
      }
    });

    return edges;
  }, [nodes, edgeWeights]);

  const modifyNodeValue = (id: TreeNodeID, s: string) => {
    const n = s.endsWith(".") ? s.concat("0") : s;
    const p = parseFloat(n);
    if (!Number.isNaN(p)) {
      nodeDispatch({
        type: "modify_value",
        node: id,
        value: p,
      });
    }
  };

  const moveNode = (id: TreeNodeID, p: Point) => {
    nodeDispatch({
      type: "move",
      id,
      position: p,
    });
  };

  // moveTarget => target
  const installRay = (target: TreeNodeID, type: EdgeType, weight?: number) => {
    if (newRayPosition !== null && moveTarget && target !== moveTarget) {
      if (!nodes[moveTarget].adjacent.some((a) => a.to === target)) {
        const tgraph = nodes[target].graph;
        nodeDispatch({
          type: "install_ray",
          source: moveTarget,
          destination: target,
          edgeType: type,
        });

        nodeDispatch({
          type: "change_graph",
          graph: tgraph,
          id: moveTarget,
        });

        graphDispatch({
          type: "remove_node",
          graph_id: nodes[moveTarget].graph,
          node_id: moveTarget,
        });

        graphDispatch({
          type: "add_node",
          graph_id: nodes[target].graph,
          node_id: moveTarget,
        });

        if (graphs[nodes[moveTarget].graph].nodes.length - 1 === 0) {
          graphDispatch({
            type: "remove",
            id: nodes[moveTarget].graph,
          });
        }

        const id = generate_edge_id(moveTarget, target);
        if (weight) {
          const id2 = generate_edge_id(target, moveTarget);
          const w = (n: EdgeWeights) => {
            if (type === "undirected") {
              return {
                ...n,
                [id]: weight,
                [id2]: weight,
              };
            }

            return {
              ...n,
              [id]: weight,
            };
          };
          setEdgeWeights(w);
        }
      }
    }
  };

  const deleteNode = (node: TreeNodeID) => {
    const gid = nodes[node].graph;

    nodeDispatch({
      type: "delete",
      node,
    });

    graphDispatch({
      type: "remove_node",
      graph_id: gid,
      node_id: node,
    });

    if (graphs[gid].nodes.length - 1 === 0) {
      graphDispatch({
        type: "remove",
        id: gid,
      });
    }
  };

  const handleMove = (
    widget: WidgetID,
    handle: (e: FederatedPointerEvent, p: Point, s: WidgetID) => void,
  ) => {
    setMoveTarget(widget);
    setMoveOperation(() => handle);
  };

  const installNode = (pos: Point) => {
    const gid = ulid();
    const nid = ulid();
    nodeDispatch({
      type: "install_node",
      id: nid,
      position: pos,
      value: nextNodeValue,
      graph: gid,
    });
    setNextNodeValue((v) => v + 1);
    graphDispatch({
      type: "create",
      id: gid,
    });

    graphDispatch({
      type: "add_node",
      graph_id: gid,
      node_id: nid,
    });
  };

  const installArray = (pos: Point) => {
    arrayDispatch({
      type: "install",
      position: pos,
      id: ulid(),
    });
  };

  const deleteArray = (array: ArrayID) => {
    arrayDispatch({
      type: "delete",
      id: array,
    });
  };

  const extendArray = (array: ArrayID, value: number | string) => {
    arrayDispatch({
      type: "extend",
      id: array,
      value,
    });
  };

  const contractArray = (array: ArrayID) => {
    arrayDispatch({
      type: "contract",
      id: array,
    });
  };

  const moveArray = (array: ArrayID, position: Point) => {
    arrayDispatch({
      type: "move",
      id: array,
      position,
    });
  };

  const removeValueAtIndex = (array: ArrayID, index: number) => {
    arrayDispatch({
      type: "remove_at_index",
      id: array,
      index,
    });
  };

  const editArrayValue = (id: ArrayID, index: number, value: string) => {
    const n = value.endsWith(".") ? value.concat("0") : value;
    const p = parseFloat(n);

    if (!Number.isNaN(p)) {
      arrayDispatch({
        type: "modify_value",
        id,
        index,
        value: p,
      });
    }
  };

  const handleMoveNode = (
    e: FederatedPointerEvent,
    position: Point,
    moveTarget: WidgetID,
  ) => {
    if (e.ctrlKey) {
      setNewRayPosition({
        start: nodes[moveTarget].position,
        end: position,
      });
    } else {
      moveNode(moveTarget, position);
      setNewRayPosition(null);
    }
  };

  const handleMoveArray = (
    _: FederatedPointerEvent,
    position: Point,
    moveTarget: WidgetID,
  ) => {
    moveArray(moveTarget, position);
  };

  const handleMovePointerLabel = (
    _: FederatedPointerEvent,
    p: Point,
    widget: WidgetID,
  ) => {
    movePointerLabelPosition(widget, p);
  };

  // todo: snapping
  const handleMovePointerRay = (
    _: FederatedPointerEvent,
    pointTo: Point,
    widget: WidgetID,
  ) => {
    setMovingPointerRay(widget);
    setNewRayPosition({
      start: pointers[widget].position,
      end: pointTo,
    });
  };

  const editEdgeWeight = (id: EdgeID, weight: string) => {
    const p = Number.parseFloat(weight);
    const wt = Number.isNaN(p) ? edgeWeights[id] : p;
    setEdgeWeights((w) => ({
      ...w,
      [id]: wt,
    }));
  };

  const installSet = (position: Point) => {
    setDispatch({
      type: "install",
      position,
      id: ulid(),
    });
  };

  const removeSet = (id: SetID) => {
    setDispatch({
      type: "remove",
      id,
    });
  };

  const moveSet = (id: SetID, position: Point) => {
    setDispatch({
      type: "move",
      id,
      position,
    });
  };

  const addValueToSet = (id: SetID, value: number | string) => {
    setDispatch({
      type: "add_value",
      id,
      value,
    });
  };

  const removeValueFromSet = (id: SetID, value: number | string) => {
    setDispatch({
      type: "remove_value",
      id,
      value,
    });
  };

  const modifyValueFromSet = (
    id: SetID,
    oldValue: number | string,
    newValue: number | string,
  ) => {
    setDispatch({
      type: "modify_value",
      id,
      oldValue,
      newValue,
    });
  };

  const handleMoveSet = (
    _: FederatedPointerEvent,
    p: Point,
    widget: WidgetID,
  ) => {
    moveSet(widget, p);
  };

  // maybe buggy because of the setstateactions
  const cancelAction = useEffectEvent(() => {
    setNewRayPosition(null);
    setNewPointerLabelPosition(null);
  });

  useEffect(() => {
    const ca = cancelAction;
    document.addEventListener("keyup", cancelAction);

    return () => {
      document.removeEventListener("keyup", ca);
    };
  });

  return (
    <Application
      eventFeatures={{
        move: true,
        click: true,
        wheel: true,
      }}
      height={900}
      width={1200}
      eventMode="static"
      autoStart
      antialias
    >
      <ThemeContext
        value={{
          selected: "green",
          targetable: "#efbaac",
        }}
      >
        <pixiContainer
          eventMode="static"
          interactiveChildren
          ref={clickArea}
          hitArea={bound}
          onPointerTap={(e: FederatedPointerEvent) => {
            e.stopPropagation();
            ("pointer tap");
            if (clickArea.current && !moveTarget && !selected) {
              const localPos = e.getLocalPosition(clickArea.current);
              handleCanvasTapAction(localPos);
            }
          }}
          onPointerMove={(e: FederatedPointerEvent) => {
            if (clickArea.current) {
              const local = e.getLocalPosition(clickArea.current);

              if (moveTarget) {
                moveOperation(e, local, moveTarget);
              } else if (newRayPosition) {
                const { start } = newRayPosition;
                setNewRayPosition({ start, end: local });
              }
              localPos.current = local;
            }
          }}
          onPointerUp={() => {
            setMoveTarget(null);
            setNewRayPosition(null);
          }}
          onPointerDown={() => {
            setMoveTarget(null);
            setSelected(null);
          }}
        >
          {newRayPosition && (
            <Ray
              start={{ x: newRayPosition.start.x, y: newRayPosition.start.y }}
              end={{ x: newRayPosition.end.x, y: newRayPosition.end.y }}
            />
          )}

          {newPointerLabelPosition && (
            <pixiGraphics
              draw={(g) => {
                g.clear();
                g.setFillStyle({ color: "green", alpha: 0.8 });
                g.circle(0, 0, 24);
                g.fill();
              }}
              zIndex={1}
            />
          )}
          {createEdges.map(({ id, type, from, to, weight }) => (
            <GraphEdge
              key={id}
              id={id}
              type={type}
              weight={weight}
              setSelected={setSelected}
              selected={selected?.widget === id}
              start={from}
              end={to}
              onTextCommit={(s: string) => editEdgeWeight(id, s)}
            />
          ))}
          {Object.entries(nodes).map(([id, { value, position }]) => (
            <TreeNodeWidget
              key={id}
              handleDelete={() => deleteNode(id)}
              id={id}
              setSelected={setSelected}
              selected={selected?.widget === id}
              value={value}
              position={position}
              handleMove={() => handleMove(id, handleMoveNode)}
              lookingForRay={newRayPosition !== null}
              lookingForPointer={
                movingPointerRay !== null || newPointerLabelPosition !== null
              }
              pointerSetter={() => {
                handleInstallPointer({ type: "node", id });
              }}
              installRay={() => installRay(id, edgeType, 0)}
              onModifyValue={(v: string) => modifyNodeValue(id, v)}
            />
          ))}
          {Object.entries(arrays).map(([id, { values, position }]) => (
            <ArrayWidget
              key={id}
              id={id}
              values={values}
              removeAtIndex={(i: number) => removeValueAtIndex(id, i)}
              position={position}
              selected={selected}
              setSelected={setSelected}
              handleDelete={() => deleteArray(id)}
              handleMove={() => handleMove(id, handleMoveArray)}
              onTextCommit={(i: number, s: string) => editArrayValue(id, i, s)}
              extend={(v: string | number) => extendArray(id, v)}
              contract={() => contractArray(id)}
              // TODO: implement this
              lookingForPointer={
                newRayPosition !== null && movingPointerRay !== null
              }
              pointerSetter={(index?: number) => {
                handleInstallPointer({ id, type: "array", arrayIndex: index });
              }}
              direction="row"
            />
          ))}
          {Object.entries(pointers).map(
            ([
              id,
              {
                label,
                position: nodePosition,
                pointTo: { id: widget_id, type },
              },
            ]) => (
              <PointerWidget
                hideRay={id === movingPointerRay}
                id={id}
                key={id}
                value={valueFromCollection(type, widget_id)}
                rayEnd={pointFromCollection(type, widget_id) || new Point(0, 0)}
                nodePosition={nodePosition}
                label={label}
                selected={selected?.widget === id}
                setSelected={setSelected}
                onModifyValue={(label: string) => changePointerLabel(id, label)}
                handleDelete={() => deletePointer(label)}
                handleMoveLabel={() => handleMove(id, handleMovePointerLabel)}
                handleMoveRay={() => handleMove(id, handleMovePointerRay)}
                lookingForPointer={
                  newRayPosition !== null && movingPointerRay !== null
                }
                pointerSetter={() => {
                  handleInstallPointer({ type: "pointer", id });
                }}
              />
            ),
          )}

          {Object.entries(sets).map((v) => {
            const [id, item] = v;

            return (
              <SetWidget
                key={id}
                id={id}
                set={item.values}
                position={item.position}
                selected={selected}
                handleDelete={() => removeSet(id)}
                setSelected={(s: SelectedWidget) => setSelected(s)}
                handleMove={() => handleMove(id, handleMoveSet)}
                onTextCommit={(
                  oldvalue: string | number,
                  newvalue: string | number,
                ) => modifyValueFromSet(id, oldvalue, newvalue)}
                removeKey={(s: string | number) => removeValueFromSet(id, s)}
                extend={(v) => addValueToSet(id, v)}
              />
            );
          })}
        </pixiContainer>
      </ThemeContext>
      <WidgetPanel
        widgets={[
          {
            // change
            component: <Circle />,
            onClick: () => {
              setHandleCanvasTapAction((p: Point) => {
                installNode(p);
              });
            },
            descriptiveText: "Create Node",
          },
          {
            // change
            component: <Square />,
            onClick: () => {
              setHandleCanvasTapAction((p: Point) => {
                installArray(p);
              });
            },
            descriptiveText: "Create Array",
          },
          {
            //change this
            component: <LineChart />,
            onClick: () => {
              setEdgeType("directed");
            },
            descriptiveText: "Set Directed Edge Type",
          },
          {
            // change this
            component: <ArrowBigLeft />,
            onClick: () => {
              setEdgeType("undirected");
            },
            descriptiveText: "Set Undirected Edge Type",
          },
          {
            // change this

            component: <Circle />,
            onClick: () => {
              setHandleCanvasTapAction((p: Point) => {
                initializePointer(p);
              });
            },
            descriptiveText: "Create Pointer",
          },
          {
            // change this

            component: <Circle />,
            onClick: () => {
              setHandleCanvasTapAction((p: Point) => {
                installSet(p);
              });
            },
            descriptiveText: "Install Set",
          },
        ]}
      />
    </Application>
  );
}
