import { Node, useEdgesState, useNodesState } from "reactflow";
import FlowView from "./flow-view";
import { useState } from "react";
import { cn } from "../lib/utils";
import {
  getDefaultData,
  getDetailsComponentFromNode,
} from "../lib/node-helpers";

const initialStartNode = {
  id: "0",
  type: "start",
  position: { x: 0, y: 0 },
  data: getDefaultData("start"),
} as Node;

export default function Editor() {
  const [nodes, setNodes, onNodesChange] = useNodesState([initialStartNode]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [selectedNodeIndex, setSelectedNodeIndex] = useState<number>(-1);

  const onNodeUpdate = (nodeId: string, data: any) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === nodeId) {
          n.data = data;
        }
        return n;
      })
    );
  };

  const DetailsComponent =
    selectedNodeIndex !== -1
      ? getDetailsComponentFromNode(nodes[selectedNodeIndex])
      : null;

  return (
    <>
      <FlowView
        onNodeSelect={setSelectedNodeIndex}
        updateNode={onNodeUpdate}
        nodes={nodes}
        setNodes={setNodes}
        onNodesChange={onNodesChange}
        edges={edges}
        setEdges={setEdges}
        onEdgesChange={onEdgesChange}
      />
      <aside
        className={cn(
          "w-0 ease-in-out transition-all duration-300",
          selectedNodeIndex !== -1 && "w-[600px] min-w-[600px]"
        )}
      >
        <div
          className={cn(
            "p-6 fixed -right-[600px] w-[600px] border-l shadow-md min-h-screen ease-in-out transition-all duration-300",
            selectedNodeIndex !== -1 && "right-0"
          )}
        >
          {DetailsComponent && (
            <DetailsComponent
              selectedNode={nodes[selectedNodeIndex]}
              updateNode={onNodeUpdate}
              close={() => setSelectedNodeIndex(-1)}
            />
          )}
        </div>
      </aside>
    </>
  );
}
