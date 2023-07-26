import React from "react";
import { ApolloNodeType } from "@/types";
import { NodeIcons } from "./icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface DraggableElementProps extends React.HTMLAttributes<HTMLDivElement> {
  node: ApolloNodeType;
  onNodeDrag: (
    event: React.DragEvent<HTMLDivElement>,
    type: ApolloNodeType
  ) => void;
}

export default function DraggableElement({
  node,
  onNodeDrag,
  ...props
}: DraggableElementProps) {
  const NodeIcon = NodeIcons[node];
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className="cursor-grab hover:bg-slate-800 rounded-md p-2 translate-x-0 translate-y-0"
            onDragStart={(e) => onNodeDrag(e, node)}
            draggable
            {...props}
          >
            <NodeIcon className="h-8 w-8" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{node}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
