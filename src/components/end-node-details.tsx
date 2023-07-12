import { Icons } from "./icons";
import { Button } from "./ui/button";

import { DataIn } from "@/types";
import { NodeDetailsProps } from "./function-node-details";
import BaseDetailsSheet from "./base-details-sheet";

export default function EndNodeDetails({
  selectedNode,
  close,
}: NodeDetailsProps) {
  return (
    <BaseDetailsSheet
      title="Workflow end"
      description="This node signals the end of the workflow. The outputs of the workflow
          are listed here."
      close={close}
      selectedNode={selectedNode}
    >
      {selectedNode.data.dataIns?.length && (
        <h1 className="text-sm font-medium leading-none mt-4">
          Workflow Outputs
        </h1>
      )}

      {selectedNode.data.dataIns?.map((input: DataIn, idx: number) => (
        <div key={idx.toString()} className="flex items-center justify-between">
          <p>{input.source}</p>
          <Button type="button" variant="ghost" size="icon">
            <Icons.remove className="w-5 text-destructive" strokeWidth={2} />
          </Button>
        </div>
      ))}
    </BaseDetailsSheet>
  );
}
