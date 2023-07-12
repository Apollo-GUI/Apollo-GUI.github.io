import { Icons } from "./icons";
import { Button } from "./ui/button";

import { DataIn } from "@/types";
import { NodeDetailsProps } from "./function-node-details";

export default function EndNodeDetails({
  selectedNode,
  close,
}: NodeDetailsProps) {
  return (
    <>
      <div className="flex justify-between items-center mr-12">
        <div className="text-slate-500 max-w-[400px]">
          <h1 className="text-lg font-semibold text-foreground">Workflow end</h1>
          This node signals the end of the workflow. The outputs of the workflow are listed here.
        </div>
        <Button variant={"destructive"}>
          <Icons.trash className="w-4 h-4" />
        </Button>
      </div>
      <div
        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
        onClick={close}
      >
        <Icons.close className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </div>
      <h1 className="text-sm font-medium leading-none mt-4">Workflow Outputs</h1>
  
      {selectedNode.data.dataIns?.map((input: DataIn, idx: number) => (
        <div key={idx.toString()} className="flex items-center justify-between">
          <p>{input.source}</p>
          <Button type="button" variant="ghost" size="icon">
            <Icons.remove className="w-5 text-destructive" strokeWidth={2} />
          </Button>
        </div>
      ))}
      
    
    </>
  );
}
