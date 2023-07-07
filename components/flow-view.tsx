import { useCallback, useMemo, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  MiniMap,
  Node,
  ReactFlowInstance,
  OnNodesChange,
  OnEdgesChange,
  addEdge,
  Connection,
  useReactFlow,
} from "reactflow";
import { getDefaultData } from "../lib/node-helpers";
import { ApolloNodeType, DataIn } from "../src/types";
import FunctionNode from "./nodes/function-node";
import StartNode from "./nodes/start-node";
import EndNode from "./nodes/end-node";
import ParallelNode from "./nodes/parallel-node";

let id = 1;
const getId = () => `${id++}`;

interface FlowViewProps {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  onNodesChange: OnNodesChange;
  onNodeSelect: (index: number) => void;
  edges: Edge[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onEdgesChange: OnEdgesChange;
  updateNode: (nodeId: string, data: any) => void;
}

export default function FlowView({
  nodes,
  setNodes,
  onNodesChange,
  onNodeSelect,
  edges,
  setEdges,
  onEdgesChange,
  updateNode,
}: FlowViewProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] =
    useState<ReactFlowInstance | null>(null);
  const { getIntersectingNodes } = useReactFlow();
  const nodeTypes = useMemo(
    () => ({
      start: StartNode,
      function: FunctionNode,
      parallel: ParallelNode,
      end: EndNode,
    }),
    []
  );

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source === params.target) return;
      const source = nodes.find((n) => n.id === params.source);
      const target = nodes.find((n) => n.id === params.target);
      const inputIndex = Number(params.sourceHandle?.substring(1));
      if (
        source &&
        target &&
        !isNaN(inputIndex) &&
        !target.data.dataIns?.find(
          (currentInputs: DataIn) =>
            currentInputs.name === source.data.dataOuts[inputIndex].name
        )
      ) {
        const input =
          source.type === "parallel"
            ? source.data.dataIns[inputIndex]
            : source.data.dataOuts[inputIndex];
        updateNode(target.id, {
          ...target.data,
          dataIns: [
            ...(target.data.dataIns ?? []),
            { name: input.name, source: source.data.name + "/" + input.name },
          ],
        });
      }
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges, nodes, updateNode]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer!.dropEffect = "move";
  }, []);

  const onNodeDrag = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const intersections = getIntersectingNodes(node).map((n) => n.id);

      setNodes((ns) =>
        ns.map((n) => ({
          ...n,
          className:
            intersections.includes(n.id) && n.type === "parallel"
              ? "shadow-[0_0_50px_15px_rgba(0,0,0,0.3)] rounded-lg"
              : "",
        }))
      );
    },
    [getIntersectingNodes, setNodes]
  );

  const onNodeDragStop = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const intersections = getIntersectingNodes(node);
      const intersectedParallel = intersections.find(
        (n) => n.type === "parallel"
      );
      if (intersectedParallel) {
        setNodes((ns) =>
          ns.map((n) => {
            if (n.id === intersectedParallel.id) {
              return {
                ...n,
                className: "",
              };
            }
            if (n.id === node.id) {
              return {
                ...n,
                parentNode: intersectedParallel.id,
                extent: "parent",
                ...(n.parentNode !== intersectedParallel.id && {
                  position: {
                    x: n.position.x - intersectedParallel.position.x,
                    y: n.position.y - intersectedParallel.position.y,
                  },
                }),
              };
            }
            return n;
          })
        );
      }
    },
    [setNodes, getIntersectingNodes]
  );

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer?.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance?.project({
        x: event.clientX - (reactFlowBounds?.left ?? 0),
        y: event.clientY - (reactFlowBounds?.top ?? 0),
      });
      const newNode = {
        id: getId(),
        type: type,
        position,
        data: getDefaultData(type as ApolloNodeType),
      } as Node;

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  return (
    <div className="h-full w-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodeClick={(_, node) =>
          onNodeSelect(nodes.findIndex((n) => n.id === node.id))
        }
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        onDragOver={onDragOver}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <MiniMap zoomable pannable />
        <Controls />
        <Background color="#aaa" gap={16} />
      </ReactFlow>
    </div>
  );
}
