import { Node, useEdgesState, useNodesState, useReactFlow } from "reactflow";
import FlowView from "./flow-view";
import { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import {
  getDefaultData,
  getDetailsComponentFromNode,
} from "../lib/node-helpers";
import { Workflow } from "@/types";
import { useLeavePage } from "@/lib/helpers";

export interface EditorProps {
  selectedWorkflow: Workflow;
  setSelectedWorkflow: (workflow: Workflow | null) => void;
}

const initialStartNode = {
  id: "0",
  type: "start",
  deletable: false,
  position: { x: 0, y: 0 },
  data: getDefaultData("start"),
} as Node;

export default function Editor({
  selectedWorkflow,
  setSelectedWorkflow,
}: EditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    selectedWorkflow.data?.nodes ?? [initialStartNode]
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    selectedWorkflow.data?.edges ?? []
  );

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

  const selectedNode =
    selectedNodeIndex !== -1 ? nodes[selectedNodeIndex] : null;

  const DetailsComponent = selectedNode
    ? getDetailsComponentFromNode(selectedNode)
    : undefined;

  const { toObject } = useReactFlow();

  const confirmLeave = useLeavePage(selectedWorkflow, setSelectedWorkflow);

  useEffect(() => {
    const confirmLeaveUnload = (e: BeforeUnloadEvent) => {
      const oldData = JSON.parse(
        localStorage.getItem(selectedWorkflow.id) ?? "{}"
      ).data;
      const newData = toObject();
      if (
        oldData === undefined ||
        !(
          JSON.stringify(newData.nodes) === JSON.stringify(oldData.nodes) &&
          JSON.stringify(newData.edges) === JSON.stringify(oldData.edges)
        )
      ) {
        e.preventDefault();
        e.stopPropagation();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", confirmLeaveUnload);
    window.addEventListener("popstate", confirmLeave);

    return () => {
      window.removeEventListener("beforeunload", confirmLeaveUnload);
      window.removeEventListener("popstate", confirmLeave);
    };
  }, [confirmLeave, selectedWorkflow.id, toObject]);

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
          selectedNode && "w-[600px] min-w-[600px]"
        )}
      >
        <div
          className={cn(
            "p-6 fixed -right-[600px] w-[600px] border-l shadow-md min-h-screen ease-in-out transition-all duration-300",
            selectedNode && "right-0"
          )}
        >
          {selectedNode && DetailsComponent && (
            <DetailsComponent
              selectedNode={selectedNode}
              updateNode={onNodeUpdate}
              close={() => setSelectedNodeIndex(-1)}
              updateSelectedWorkflowName={(name: string) =>
                setSelectedWorkflow({ ...selectedWorkflow, name })
              }
            />
          )}
        </div>
      </aside>
    </>
  );
}
