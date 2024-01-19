import { Icons } from "./icons";
import DeleteNodeButton from "./delete-node-button";
import { Node } from "reactflow";

export interface BaseDetailsSheetProps {
  title: string;
  description: string;
  children: React.ReactNode;
  selectedNode: Node;
  close: () => void;
}

export default function BaseDetailsSheet({
  title,
  description,
  children,
  selectedNode,
  close,
}: BaseDetailsSheetProps) {
  return (
    <div className="overflow-y-scroll max-h-[100vh] p-6">
      <div className="flex justify-between items-center mr-12">
        <div className="text-slate-500 max-w-[400px]">
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          {description}
        </div>
        {selectedNode.deletable !== false && (
          <DeleteNodeButton selectedNode={selectedNode} />
        )}
      </div>
      <div
        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
        onClick={close}
      >
        <Icons.close className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </div>
      {children}
    </div>
  );
}
