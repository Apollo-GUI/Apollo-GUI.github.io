import React from "react";
import { ApolloNodeType } from "@/types";
import { NodeIcons } from "./icons";

interface DraggableElementProps extends React.HTMLAttributes<HTMLDivElement> {
  node: ApolloNodeType;
  onNodeDrag: (event: React.DragEvent<HTMLDivElement>, type: ApolloNodeType) => void;
}

export default function DraggableElement({node,onNodeDrag, ...props}: DraggableElementProps) {
  const NodeIcon = NodeIcons[node];
  return <div className="cursor-grab hover:bg-slate-800 rounded-md p-2 translate-x-0 translate-y-0" onDragStart={(e)=>onNodeDrag(e,node)} draggable {...props}>
        <NodeIcon className="h-8 w-8" />
  </div>;

}
