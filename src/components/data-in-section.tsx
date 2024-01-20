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
import PropteriesConstraintsDialog from "./properties-constraints-dialog";

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
    (i: DataIn) => i.source === selectedNode.id,
  );
  const parentInputs = selectedNode.data.dataIns?.filter(
    (i: DataIn) => i.source !== selectedNode.id,
  );

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
          {parentInputs.map((input: DataIn) => (
            <div
              key={input.id}
              className="grid gap-2 grid-cols-[3fr_2fr_25px_25px] items-center mt-2"
            >
              <p className="bg-slate-200 rounded px-4 mr-auto">
                {getFullDataOutName(input.source, input.id)}
              </p>

              <Input
                key={"rename" + input.id}
                id="rename"
                type="text"
                placeholder="(optinal rename)"
                className="max-w-[200px]"
                value={input.rename}
                onChange={(e) => {
                  const index = selectedNode.data.dataIns.findIndex(
                    (el: any) => el.id === input.id,
                  );
                  selectedNode.data.dataIns[index].rename = e.target.value;
                  updateNode(selectedNode.id, {
                    ...selectedNode.data,
                  });
                  updateNodeInternals(selectedNode.id);
                }}
              />

              <PropteriesConstraintsDialog
                properties={input.properties}
                constraints={input.constraints}
                onChange={(properties, constraints) => {
                  const index = selectedNode.data.dataIns.findIndex(
                    (el: any) => el.id === input.id,
                  );
                  selectedNode.data.dataIns[index].properties = properties;
                  selectedNode.data.dataIns[index].constraints = constraints;
                  updateNode(selectedNode.id, {
                    ...selectedNode.data,
                  });
                }}
              />
              <Button type="button" variant="ghost" size="icon" className="w-8 p-0">
                <Icons.remove
                  className="w-5 text-destructive"
                  strokeWidth={2}
                  onClick={() => {
                    updateNode(selectedNode.id, {
                      ...selectedNode.data,
                      dataIns: selectedNode.data.dataIns.filter(
                        (d: DataIn) => d.id !== input.id,
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

          <div className="grid gap-2 grid-cols-[2fr_1fr_2fr_25px_25px] mt-2 items-center">
            {staticInputs.map((input: DataIn) => (
              <>
                <Input
                  key={"name" + input.id}
                  id="staticInputs"
                  type="text"
                  placeholder="variable name"
                  value={input.name}
                  onChange={(e) => {
                    const index = selectedNode.data.dataIns.findIndex(
                      (el: any) => el.id === input.id,
                    );
                    selectedNode.data.dataIns[index].name = e.target.value;
                    updateNode(selectedNode.id, {
                      ...selectedNode.data,
                    });

                    updateNodeInternals(selectedNode.id);
                  }}
                />
                <Select
                  value={input.type}
                  key={"type" + input.id}
                  onValueChange={(e) => {
                    const index = selectedNode.data.dataIns.findIndex(
                      (el: any) => el.id === input.id,
                    );
                    selectedNode.data.dataIns[index].type = e;
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
                  key={"value" + input.id}
                  id="value"
                  type="text"
                  placeholder="value"
                  value={input.value}
                  onChange={(e) => {
                    const index = selectedNode.data.dataIns.findIndex(
                      (el: any) => el.id === input.id,
                    );
                    selectedNode.data.dataIns[index].value = e.target.value;
                    updateNode(selectedNode.id, {
                      ...selectedNode.data,
                    });
                  }}
                />

                <PropteriesConstraintsDialog
                  properties={input.properties}
                  constraints={input.constraints}
                  onChange={(properties, constraints) => {
                    const index = selectedNode.data.dataIns.findIndex(
                      (el: any) => el.id === input.id,
                    );
                    selectedNode.data.dataIns[index].properties = properties;
                    selectedNode.data.dataIns[index].constraints = constraints;
                    updateNode(selectedNode.id, {
                      ...selectedNode.data,
                    });
                  }}
                />

                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 p-0"
                  key={"del" + input.id}
                  onClick={() => {
                    updateNode(selectedNode.id, {
                      ...selectedNode.data,
                      dataIns: selectedNode.data.dataIns.filter(
                        (d: DataIn) => d.id !== input.id,
                      ),
                    });
                    updateNodeInternals(selectedNode.id);
                  }}
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
        onClick={() => {
          updateNode(selectedNode.id, {
            ...selectedNode.data,
            dataIns: [
              ...(selectedNode.data.dataIns ?? []),
              { id: uuidv4(), name: "", type: "", source: selectedNode.id },
            ],
          });
          updateNodeInternals(selectedNode.id);
        }}
      >
        <Icons.add className="w-4 h-4 mr-2" /> Add static inputs
      </Button>
    </>
  );
}
