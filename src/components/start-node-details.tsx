import { Icons } from "./icons";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { DataOut, dataTypes } from "@/types";
import { NodeDetailsProps } from "./function-node-details";
import BaseDetailsSheet from "./base-details-sheet";
import { uuidv4 } from "@/lib/helpers";
import InfoButton from "./info-button";

export default function StartNodeDetails({
  selectedNode,
  updateNode,
  updateSelectedWorkflowName,
  close,
}: NodeDetailsProps) {
  return (
    <BaseDetailsSheet
      title="Workflow start"
      description="Here you can edit the general attributes of the workflow"
      close={close}
      selectedNode={selectedNode}
    >
      <div className="grid gap-2 mt-4">
        <Label htmlFor="name">Workflow name</Label>
        <Input
          id="name"
          type="text"
          placeholder="name"
          onChange={(e) => {
            updateNode(selectedNode.id, {
              ...selectedNode.data,
              name: e.target.value,
            });
            updateSelectedWorkflowName(e.target.value);
          }}
          value={selectedNode.data.name}
        />
      </div>
      <Separator className="my-4" />
      <h1 className="text-lg font-semibold text-foreground">Workflow inputs</h1>
      <p className="text-sm text-slate-500">
        These inputs will be available to all nodes in the workflow and are
        provided at runtime to the workflow.
      </p>
      {selectedNode.data.dataOuts.length > 0 && (
        <div className="grid grid-cols-[2fr_1fr_2fr_30px] gap-2 mt-4">
          <Label htmlFor="staticInputs">Name</Label>
          <Label htmlFor="staticInputs">Type</Label>
          <p className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex gap-1">
            Source
            <InfoButton infoText="This specifies the name JOSN property in the input to the workflow." />
          </p>
          <div />
          {selectedNode.data.dataOuts.map((output: DataOut, idx: number) => (
            <>
              <Input
                key={"name" + idx}
                id="staticInputs"
                type="text"
                placeholder="name"
                value={output.name}
                onChange={(e) => {
                  selectedNode.data.dataOuts[idx].name = e.target.value;
                  updateNode(selectedNode.id, {
                    ...selectedNode.data,
                  });
                }}
              />
              <Select
                value={output.type}
                key={"type" + idx}
                onValueChange={(e) => {
                  selectedNode.data.dataOuts[idx].type = e;
                  updateNode(selectedNode.id, {
                    ...selectedNode.data,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dataTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                key={"source" + idx}
                id="staticInputsSource"
                type="text"
                placeholder="source"
                value={output.startSource}
                onChange={(e) => {
                  selectedNode.data.dataOuts[idx].startSource = e.target.value;
                  updateNode(selectedNode.id, {
                    ...selectedNode.data,
                  });
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                key={"del" + idx}
                onClick={() =>
                  updateNode(selectedNode.id, {
                    ...selectedNode.data,
                    dataOuts: selectedNode.data.dataOuts.filter(
                      (_: DataOut, index: number) => index !== idx,
                    ),
                  })
                }
              >
                <Icons.remove
                  className="w-5 text-destructive"
                  strokeWidth={2}
                />
              </Button>
            </>
          ))}
        </div>
      )}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={() =>
          updateNode(selectedNode.id, {
            ...selectedNode.data,
            dataOuts: [
              ...(selectedNode.data.dataOuts ?? []),
              { id: uuidv4(), name: "", type: "" },
            ],
          })
        }
      >
        <Icons.add className="w-4 h-4 mr-2" /> Add input
      </Button>
    </BaseDetailsSheet>
  );
}
