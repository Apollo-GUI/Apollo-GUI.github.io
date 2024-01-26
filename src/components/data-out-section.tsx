import { DataIn, DataOut, dataTypes } from "@/types";
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
import { UpdateNodeSectionProps } from "./data-in-section";
import { useDataVariables, uuidv4 } from "@/lib/helpers";
import { useReactFlow, useUpdateNodeInternals } from "reactflow";
import PropteriesConstraintsDialog from "./properties-constraints-dialog";

export default function DataOutSection({
  selectedNode,
  updateNode,
}: UpdateNodeSectionProps) {
  const { getFullDataOutName } = useDataVariables();
  const updateNodeInternals = useUpdateNodeInternals();
  const { getNode } = useReactFlow();
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-foreground mr-1">
          Data Outputs
        </h1>
        <InfoButton
          infoText="Here you can specify new outputs of the function. If you can also add
    inputs to this function as outputs but it may be better to connect them
    from their origin."
        />
      </div>
      {selectedNode.data.dataOuts?.length > 0 && (
        <div className="grid grid-cols-[2fr_1fr_25px_25px] items-center gap-2 mt-4">
          <Label>Name</Label>
          <Label>Type</Label>
          <div />
          <div />
          {selectedNode.data.dataOuts.map((output: DataOut, idx: number) => (
            <>
              {output.source !== undefined ? (
                getNode(output.source)?.parentNode === selectedNode.id ? (
                  <>
                    <div
                      key={idx.toString()}
                      className="flex items-center justify-between"
                    >
                      <p className="bg-slate-200 rounded px-4">
                        {getFullDataOutName(
                          output.source,
                          output.id,
                          selectedNode,
                        )}
                      </p>
                    </div>

                    <Input
                      key={"rename" + output.id}
                      id="rename"
                      type="text"
                      placeholder="(optinal rename)"
                      className="max-w-[200px]"
                      value={output.rename}
                      onChange={(e) => {
                        const index = selectedNode.data.dataOuts.findIndex(
                          (el: any) => el.id === output.id,
                        );
                        selectedNode.data.dataOuts[index].rename =
                          e.target.value;
                        updateNode(selectedNode.id, {
                          ...selectedNode.data,
                        });
                        updateNodeInternals(selectedNode.id);
                      }}
                    />
                  </>
                ) : (
                  <Select
                    value={output.id}
                    key={"source" + idx}
                    onValueChange={(e) => {
                      selectedNode.data.dataOuts[idx] =
                        selectedNode.data.dataIns.find(
                          (i: DataIn) => i.id === e,
                        );
                      updateNode(selectedNode.id, {
                        ...selectedNode.data,
                      });
                      updateNodeInternals(selectedNode.id);
                    }}
                  >
                    <SelectTrigger className="col-span-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedNode.data.dataIns.map(
                        (input: DataIn, i: number) => (
                          <SelectItem key={i.toString()} value={input.id}>
                            {input.source !== selectedNode.id
                              ? getFullDataOutName(
                                  input.source,
                                  input.id,
                                  selectedNode,
                                )
                              : input.name}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                )
              ) : (
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
                </>
              )}

              <PropteriesConstraintsDialog
                properties={output.properties}
                constraints={output.constraints}
                onChange={(properties, constraints) => {
                  const index = selectedNode.data.dataOuts.findIndex(
                    (el: any) => el.id === output.id,
                  );
                  selectedNode.data.dataOuts[index].properties = properties;
                  selectedNode.data.dataOuts[index].constraints = constraints;
                  updateNode(selectedNode.id, {
                    ...selectedNode.data,
                  });
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="w-8 p-0"
                key={"del" + idx}
                onClick={() => {
                  updateNode(selectedNode.id, {
                    ...selectedNode.data,
                    dataOuts: selectedNode.data.dataOuts.filter(
                      (_: DataOut, index: number) => index !== idx,
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
      )}
      <div className="flex space-x-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => {
            updateNode(selectedNode.id, {
              ...selectedNode.data,
              dataOuts: [
                ...(selectedNode.data.dataOuts ?? []),
                { id: uuidv4(), name: "", type: "" },
              ],
            });
            updateNodeInternals(selectedNode.id);
          }}
        >
          <Icons.add className="w-4 h-4 mr-2" /> Add new output
        </Button>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => {
            updateNode(selectedNode.id, {
              ...selectedNode.data,
              dataOuts: [
                ...(selectedNode.data.dataOuts ?? []),
                { id: uuidv4(), source: "" },
              ],
            });
            updateNodeInternals(selectedNode.id);
          }}
        >
          <Icons.add className="w-4 h-4 mr-2" /> Add from input
        </Button>
      </div>
    </>
  );
}
