import { Application, extend } from "@pixi/react";
import { Input } from "@pixi/ui";
import {
  BitmapText,
  Container,
  FederatedPointerEvent,
  Graphics,
  type PointData,
  Rectangle,
  Text,
  Triangle,
} from "pixi.js";
import { useMemo, useRef, useState } from "react";
import { monotonicFactory } from "ulid";
import Node from "./Node";
import Ray from "./Ray";

const ulid = monotonicFactory();

extend({
  Container,
  Graphics,
  FederatedPointerEvent,
  Text,
  Triangle,
  Input,
  BitmapText,
});

type WidgetID = string;
type NodeID = WidgetID;

interface NodeData {
  [node: NodeID]: {
    value: number;
    position: {
      x: number;
      y: number;
    };
    isRoot: boolean;
    adjacent: NodeID[];
  };
}

const bound = new Rectangle(0, 0, 1400, 900);
export default function Canvas() {
  const clickArea = useRef<Container | null>(null);
  const app = useRef(null);
  const [nextNodeValue, setNextNodeValue] = useState(1);
  const [nodes, setNodes] = useState<NodeData>({});
  const [selected, setSelected] = useState<WidgetID | null>(null);

  const [newRayPosition, setNewRayPosition] = useState<{
    start: PointData;
    end: PointData;
  } | null>(null);

  const [moveTarget, setMoveTarget] = useState<NodeID | null>(null);

  const createEdges = useMemo(() => {
    const generate_id = (one: string, another: string) => {
      if (one.localeCompare(another) === -1) {
        return `${one}-${another}`;
      }

      return `${another}-${one}`;
    };

    const edges: [string, [PointData, PointData]][] = [];
    const generated_ids = new Set();

    Object.entries(nodes).forEach(([id, data]) => {
      const { adjacent, position } = data;

      for (const a in adjacent) {
        const i = generate_id(id, adjacent[a]);
        if (!generated_ids.has(i)) {
          edges.push([i, [position, nodes[adjacent[a]].position]]);
          generated_ids.add(i);
        }
      }
    });

    return edges;
  }, [nodes]);

  const installRay = (target: NodeID) => {
    if (newRayPosition !== null && moveTarget && target !== moveTarget) {
      if (!nodes[target].adjacent.includes(moveTarget)) {
        setNodes((n) => ({
          ...n,
          [target]: {
            ...n[target],
            adjacent: n[target].adjacent.concat(moveTarget),
          },

          [moveTarget]: {
            ...n[moveTarget],
            adjacent: n[moveTarget].adjacent.concat(target),
          },
        }));
      }
    }
  };

  const deleteNode = (node: NodeID) => {
    const next: NodeData = {};
    Object.entries(nodes).forEach((n) => {
      const [id, features] = n;

      if (id !== node) {
        next[id] = {
          ...features,
          value:
            features.value < nodes[node].value
              ? features.value
              : features.value - 1,
          adjacent: features.adjacent.filter((a) => a !== id),
        };
      }
    });

    setNodes(next);
  };

  const handleMove = (target: NodeID) => {
    setMoveTarget(target);
  };

  const handleSelect = (target: WidgetID) => {
    setSelected(target);
  };

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
      ref={app}
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
            setNodes((n) => ({
              ...n,
              [ulid()]: {
                value: nextNodeValue,
                position: localPos,
                adjacent: [],
                isRoot: false,
              },
            }));
            setNextNodeValue((v) => v + 1);
          }
        }}
        onPointerMove={(e: FederatedPointerEvent) => {
          if (clickArea.current && moveTarget) {
            const localPos = e.getLocalPosition(clickArea.current);
            if (e.ctrlKey) {
              setNewRayPosition({
                start: nodes[moveTarget].position,
                end: localPos,
              });
            } else {
              setNodes((n) => ({
                ...n,
                [moveTarget]: {
                  ...n[moveTarget],
                  position: localPos,
                },
              }));
              setNewRayPosition(null);
            }
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
        <pixiGraphics
          draw={(g) => {
            g.clear();
            g.regularPoly(100, 100, 50, 3, Math.PI / 2);
            g.fill("#FFFFFF");
          }}
        />
        {newRayPosition && (
          <pixiGraphics
            draw={(g) => {
              g.clear();
              g.moveTo(newRayPosition.start.x, newRayPosition.start.y).lineTo(
                newRayPosition.end.x,
                newRayPosition.end.y,
              );
              g.fill("#FFFFFF");
              g.stroke();
            }}
            zIndex={1}
          />
        )}

        {createEdges.map(([id, [start, end]]) => (
          <Ray
            key={id}
            id={id}
            setSelected={handleSelect}
            selected={selected === id}
            start={start}
            end={end}
          />
        ))}

        {Object.entries(nodes).map(([id, { value, position }]) => (
          <Node
            key={id}
            handleDelete={deleteNode}
            id={id}
            setSelected={handleSelect}
            selected={selected === id}
            value={value}
            position={position}
            handleMove={handleMove}
            lookingForRay={newRayPosition !== null}
            installRay={installRay}
          />
        ))}
      </pixiContainer>
    </Application>
  );
}
