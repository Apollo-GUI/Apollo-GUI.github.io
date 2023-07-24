import { NodeDetailsProps } from "./function-node-details";
import BaseDetailsSheet from "./base-details-sheet";
import NodeNameInput from "./node-name-input";
import { Separator } from "./ui/separator";
import InfoButton from "./info-button";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import DataInSection from "./data-in-section";
import { DataIn, IfData } from "@/types";
import { Checkbox } from "./ui/checkbox";
import ParentSection from "./parent-section";
import { getOutgoers, useEdges, useReactFlow } from "reactflow";

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
      <div className="flex items-center mb-2">
        <h1 className="text-lg font-semibold text-foreground mr-1">
          Condition
        </h1>
        <InfoButton infoText="" />
      </div>
      <div className="grid gap-2 grid-cols-[2fr_1fr_2fr_40px]">
        <Input id="condition" type="text" placeholder="value/variable" />
        <Input id="condition" type="text" placeholder="" />
        <Input id="condition" type="text" placeholder="value/variable" />
        <Button variant="secondary" size="icon">
          <Icons.options className="w-4 h-4" />
        </Button>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="mt-2">
            Add condition
            <Icons.down className="ml-2 h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            Combine with&nbsp;<b>AND</b>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Combine with&nbsp;<b>OR</b>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
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
              {input.source}
            </p>
            <Checkbox
              checked={input.sendToTrue}
              onCheckedChange={(c) => {
                selectedNode.data.dataIns[i].sendToTrue = c === true;
                updateNode(selectedNode.id, { ...selectedNode.data });
                getEdges()
                  .filter(
                    (e) =>
                      e.source === selectedNode.id && e.sourceHandle === "true",
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
                            (d: DataIn) => d.name !== input.name,
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
