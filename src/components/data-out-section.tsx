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

export default function DataOutSection({
  selectedNode,
  updateNode,
}: UpdateNodeSectionProps) {
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
        <div className="grid grid-cols-[3fr_1fr_30px] gap-2 mt-4">
          <Label htmlFor="staticInputs">Name</Label>
          <Label htmlFor="staticInputs">Type</Label>
          <div />
          {selectedNode.data.dataOuts.map((output: DataOut, idx: number) => (
            <>
              {output.source !== undefined ? (
                <Select
                  value={output.source}
                  key={"source" + idx}
                  onValueChange={(e) => {
                    selectedNode.data.dataOuts[idx].source = e;
                    const names = e.split("/");
                    selectedNode.data.dataOuts[idx].name =
                      names[names.length - 1];
                    updateNode(selectedNode.id, {
                      ...selectedNode.data,
                    });
                  }}
                >
                  <SelectTrigger className="col-span-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedNode.data.dataIns.map(
                      (input: DataIn, i: number) => (
                        <SelectItem
                          key={i.toString()}
                          value={
                            input.source ??
                            selectedNode.data.name + "/" + input.name
                          }
                        >
                          {input.source ??
                            selectedNode.data.name + "/" + input.name}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
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
              <Button
                type="button"
                variant="ghost"
                size="icon"
                key={"del" + idx}
                onClick={() =>
                  updateNode(selectedNode.id, {
                    ...selectedNode.data,
                    dataOuts: selectedNode.data.dataOuts.filter(
                      (_: DataOut, index: number) => index !== idx
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
      <div className="flex space-x-2">
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
                { name: "", type: "" },
              ],
            })
          }
        >
          <Icons.add className="w-4 h-4 mr-2" /> Add new output
        </Button>

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
                { name: "", type: "", source: "" },
              ],
            })
          }
        >
          <Icons.add className="w-4 h-4 mr-2" /> Add from input
        </Button>
      </div>
    </>
  );
}
