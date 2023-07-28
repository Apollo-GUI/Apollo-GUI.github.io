import { NodeDetailsProps } from "./function-node-details";
import BaseDetailsSheet from "./base-details-sheet";
import NodeNameInput from "./node-name-input";
import { Separator } from "./ui/separator";
import InfoButton from "./info-button";

import DataInSection from "./data-in-section";
import { DataIn, IfData } from "@/types";
import { Checkbox } from "./ui/checkbox";
import ParentSection from "./parent-section";
import { useReactFlow } from "reactflow";
import ConditionsSection from "./conditions-section";

export default function IfNodeDetails({
  selectedNode,
  updateNode,
  close,
}: NodeDetailsProps) {
  const { getNode, getEdges } = useReactFlow();
  return (
    <BaseDetailsSheet
      title="If condition"
      description="Branch execution of the workflow based on a condition."
      close={close}
      selectedNode={selectedNode}
    >
      <NodeNameInput selectedNode={selectedNode} updateNode={updateNode} />
      <Separator className="my-4" />
      <ConditionsSection selectedNode={selectedNode} updateNode={updateNode} />
      <Separator className="my-4" />
      <DataInSection selectedNode={selectedNode} updateNode={updateNode} />
      <Separator className="my-4" />
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-foreground mr-1">
          Data Outputs
        </h1>
        <InfoButton infoText="Here you can specify new outputs of the if condition. You can specify which input variables are passed to each of the two branches" />
      </div>
      <div className="grid gap-2 grid-cols-[1fr_80px_80px] mt-2 items-center justify-items-center">
        <h1 className="text-sm font-medium leading-none mt-2 justify-self-start">
          Data Output
        </h1>
        <h1 className="text-sm font-medium leading-none mt-2">True side</h1>
        <h1 className="text-sm font-medium leading-none mt-2">False side</h1>

        {selectedNode.data.dataIns?.map((input: IfData, i: number) => (
          <>
            <p className="bg-slate-200 rounded px-4 justify-self-start">
              {input.source ?? selectedNode.data.name + "/" + input.name}
            </p>
            <Checkbox
              checked={input.sendToTrue}
              onCheckedChange={(c) => {
                selectedNode.data.dataIns[i].sendToTrue = c === true;
                updateNode(selectedNode.id, { ...selectedNode.data });
                getEdges()
                  .filter(
                    (e) =>
                      e.source === selectedNode.id && e.sourceHandle === "true"
                  )
                  .forEach((e) => {
                    const connectedNode = getNode(e.target)!;
                    if (c === true) {
                      updateNode(e.target, {
                        ...connectedNode.data,
                        dataIns: [...connectedNode.data.dataIns, input],
                      });
                    } else {
                      updateNode(e.target, {
                        ...connectedNode.data,
                        dataIns: [
                          ...connectedNode.data.dataIns.filter(
                            (d: DataIn) => d.name !== input.name
                          ),
                        ],
                      });
                    }
                  });
              }}
            />
            <Checkbox
              checked={input.sendToFalse}
              onCheckedChange={(c) => {
                selectedNode.data.dataIns[i].sendToFalse = c === true;
                updateNode(selectedNode.id, { ...selectedNode.data });
              }}
            />
          </>
        ))}
      </div>
      <ParentSection selectedNode={selectedNode} updateNode={updateNode} />
    </BaseDetailsSheet>
  );
}
