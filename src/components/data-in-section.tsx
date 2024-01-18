import { DataIn, dataTypes } from "@/types";
import { Node, useUpdateNodeInternals } from "reactflow";
import InfoButton from "./info-button";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useDataVariables, uuidv4 } from "@/lib/helpers";

export interface UpdateNodeSectionProps {
  selectedNode: Node;
  updateNode: (nodeId: string, data: any) => void;
}

export default function DataInSection({
  selectedNode,
  updateNode,
}: UpdateNodeSectionProps) {

  const { getFullDataOutName } = useDataVariables();
  const updateNodeInternals = useUpdateNodeInternals();

  const staticInputs = selectedNode.data.dataIns?.filter(
    (i: DataIn) => i.source === selectedNode.id
  );
  const parentInputs = selectedNode.data.dataIns?.filter(
    (i: DataIn) => i.source !== selectedNode.id
  );

  const staticInputsOffset =
    selectedNode.data.dataIns?.length - staticInputs?.length;
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-foreground mr-1">
          Data Inputs
        </h1>
        <InfoButton
          infoText="Connect outputs of other nodes to add them as inputs here. You can also
    add static inputs which describe constant values that are not dependent
    on results of other functions."
        />
      </div>
      {parentInputs?.length > 0 && (
        <>
          <h1 className="text-sm font-medium leading-none mt-2">
            Input from parents
          </h1>
          {parentInputs.map((input: DataIn, idx: number) => (
            <div
              key={idx.toString()}
              className="grid gap-2 grid-cols-[3fr_2fr_40px] items-center mt-2"
            >
              <p className="bg-slate-200 rounded px-4 mr-auto">{getFullDataOutName(input.source, input.id)}</p>

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
              <Button type="button" variant="ghost" size="icon">
                <Icons.remove
                  className="w-5 text-destructive"
                  strokeWidth={2}
                  onClick={() => {
                    updateNode(selectedNode.id, {
                      ...selectedNode.data,
                      dataIns: selectedNode.data.dataIns.filter(
                        (_: DataIn, index: number) => index !== idx
                      ),
                    });
                    updateNodeInternals(selectedNode.id);
                  }}
                />
              </Button>
            </div>
          ))}
        </>
      )}
      {staticInputs?.length > 0 && (
        <>
          <Label htmlFor="staticInputs">Static inputs</Label>

          <div className="grid gap-2 grid-cols-[2fr_1fr_2fr_40px] mt-2">
            {staticInputs.map((input: DataIn, idx: number) => (
              <>
                <Input
                  key={"name" + idx}
                  id="staticInputs"
                  type="text"
                  placeholder="variable name"
                  value={input.name}
                  onChange={(e) => {
                    selectedNode.data.dataIns[staticInputsOffset + idx].name =
                      e.target.value;
                    updateNode(selectedNode.id, {
                      ...selectedNode.data,
                    });
                  }}
                />
                <Select
                  value={input.type}
                  key={"type" + idx}
                  onValueChange={(e) => {
                    selectedNode.data.dataIns[staticInputsOffset + idx].type =
                      e;
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
                  key={"value" + idx}
                  id="value"
                  type="text"
                  placeholder="value"
                  value={input.value}
                  onChange={(e) => {
                    selectedNode.data.dataIns[staticInputsOffset + idx].value =
                      e.target.value;
                    updateNode(selectedNode.id, {
                      ...selectedNode.data,
                    });
                  }}
                />

                <Button
                  variant="ghost"
                  size="icon"
                  key={"del" + idx}
                  onClick={() =>{
                    updateNode(selectedNode.id, {
                      ...selectedNode.data,
                      dataIns: selectedNode.data.dataIns.filter(
                        (_: DataIn, index: number) =>
                          index !== staticInputsOffset + idx
                      ),
                    })
                    updateNodeInternals(selectedNode.id);}
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
        </>
      )}
      <Button
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={() =>{
          updateNode(selectedNode.id, {
            ...selectedNode.data,
            dataIns: [
              ...(selectedNode.data.dataIns ?? []),
              { id:uuidv4(), name: "", type: "", source:selectedNode.id },
            ],
          })
          updateNodeInternals(selectedNode.id);}
        }
      >
        <Icons.add className="w-4 h-4 mr-2" /> Add static inputs
      </Button>
    </>
  );
}
