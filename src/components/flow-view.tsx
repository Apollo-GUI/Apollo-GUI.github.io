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
  useUpdateNodeInternals,
} from "reactflow";
import { getDefaultData } from "../lib/node-helpers";
import { ApolloNodeType, DataIn } from "@/types";
import FunctionNode from "./nodes/function-node";
import StartNode from "./nodes/start-node";
import EndNode from "./nodes/end-node";
import ParallelNode from "./nodes/parallel-node";
import IfNode from "./nodes/if-node";
import WhileNode from "./nodes/while-node";
import { uuidv4 } from "@/lib/helpers";

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
  const { getIntersectingNodes, deleteElements } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();
  const nodeTypes = useMemo(
    () => ({
      start: StartNode,
      function: FunctionNode,
      parallel: ParallelNode,
      if: IfNode,
      while: WhileNode,
      end: EndNode,
    }),
    [],
  );

  const onConnect = useCallback(
    (params: Connection) => {
      const source = nodes.find((n) => n.id === params.source);
      const target = nodes.find((n) => n.id === params.target);
      if (
        source?.id === target?.id &&
        target?.type !== "parallel" &&
        target?.type !== "while"
      )
        return;

      const inputIndex = Number(params.sourceHandle?.substring(1));
      if (source && target && !isNaN(inputIndex)) {
        const input =
          (source.type === "parallel" || source.type === "while") &&
          !params.sourceHandle?.startsWith("o")
            ? source.data.dataIns[inputIndex]
            : source.data.dataOuts[inputIndex];
        if (
          !target.data.dataIns?.find(
            (currentInputs: DataIn) => currentInputs.id === input.id,
          )
        ) {
          if (
            (target.type === "parallel" || target.type === "while") &&
            params.targetHandle === "oidefault"
          ) {
            updateNode(target.id, {
              ...target.data,
              dataOuts: [
                ...(target.data.dataOuts ?? []),
                {
                  id: input.id,
                  source: input.source??source.id,
                },
              ],
            });
          } else {
            updateNode(target.id, {
              ...target.data,
              dataIns: [
                ...(target.data.dataIns ?? []),
                {
                  id: input.id,
                  source: input.source??source.id,
                },
              ],
            });
          }
          updateNodeInternals(target.id);
        }
      }
      setEdges((eds) => addEdge(params, eds));
    },
    [nodes, setEdges, updateNode, updateNodeInternals],
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer!.dropEffect = "move";
  }, []);

  const onNodeDrag = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (node.type === "start" || node.type === "end") return;
      const intersections = getIntersectingNodes(node, false).map((n) => n.id);

      setNodes((ns) =>
        ns.map((n) => ({
          ...n,
          className:
            intersections.includes(n.id) &&
            (n.type === "parallel" || n.type === "while") &&
            node.parentNode !== n.id
              ? "shadow-[0_0_50px_15px_rgba(0,0,0,0.3)] rounded-lg"
              : "",
        })),
      );
    },
    [getIntersectingNodes, setNodes],
  );

  const onNodeDragStop = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (node.type === "start" || node.type === "end") return;
      const intersections = getIntersectingNodes(node, false);
      const intersectedBlock = intersections.findLast(
        (n) => n.type === "parallel" || n.type === "while",
      );
      if (intersectedBlock) {
        setNodes((ns) =>
          ns.map((n) => {
            if (n.id === node.id) {
              return {
                ...n,
                parentNode: intersectedBlock.id,
                extent: "parent",
                ...(n.parentNode !== intersectedBlock.id && {
                  position: {
                    x: n.position.x - intersectedBlock.positionAbsolute.x,
                    y: n.position.y - intersectedBlock.positionAbsolute.y,
                  },
                }),
              };
            }
            return {
              ...n,
              className: "",
            };
          }),
        );
      }
    },
    [setNodes, getIntersectingNodes],
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
        id: uuidv4(),
        type: type,
        position,
        style:
          type == "parallel" || type == "while"
            ? { height: "250px", width: "250px" }
            : undefined,
        data: getDefaultData(type as ApolloNodeType),
      } as Node;

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes],
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
        onNodesDelete={(n) => {
          deleteElements({
            nodes: nodes.filter((i) => i.parentNode === n[0].id),
          });
        }}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        deleteKeyCode={["Backspace", "Delete"]}
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
