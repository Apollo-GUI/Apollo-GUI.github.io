import { Icons } from "./icons";
import { Button } from "./ui/button";

import { DataIn } from "@/types";
import { NodeDetailsProps } from "./function-node-details";
import BaseDetailsSheet from "./base-details-sheet";
import { useDataVariables } from "@/lib/helpers";
import { Input } from "./ui/input";

export default function EndNodeDetails({
  selectedNode,
  updateNode,
  close,
}: NodeDetailsProps) {
  const { getFullDataOutName } = useDataVariables();
  return (
    <BaseDetailsSheet
      title="Workflow end"
      description="This node signals the end of the workflow. The outputs of the workflow
          are listed here."
      close={close}
      selectedNode={selectedNode}
    >
      {selectedNode.data.dataIns?.length ? (
        <h1 className="text-sm font-medium leading-none mt-4">
          Workflow Outputs
        </h1>
      ):<></>}

      { selectedNode.data.dataIns?.length ? (selectedNode.data.dataIns.map((input: DataIn, idx: number) => (
        <div key={input.id} className="grid gap-2 grid-cols-[3fr_2fr_40px] items-center mt-2">
          <p className="bg-slate-200 rounded px-4 mr-auto">{getFullDataOutName(input.source, input.id, selectedNode)}</p>

              <Input
                key={"rename"+idx.toString()}
                id="rename"
                type="text"
                placeholder="(optinal rename)"
                className="max-w-[200px]"
                value={input.rename}
                onChange={(e) => {
                  selectedNode.data.dataIns[idx].rename = e.target.value;
                  updateNode(selectedNode.id, {
                    ...selectedNode.data,
                  });
                }}
              />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              updateNode(selectedNode.id, {
                ...selectedNode.data,
                dataIns: selectedNode.data.dataIns.filter(
                  (_: DataIn, index: number) => index !== idx
                ),
              });
            }}
          >
            <Icons.remove className="w-5 text-destructive" strokeWidth={2} />
          </Button>
        </div>
      ))):<></>}
    </BaseDetailsSheet>
  );
}
