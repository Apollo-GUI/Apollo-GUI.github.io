import { Icons } from "./icons";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import InfoButton from "./info-button";
import { Separator } from "./ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Node } from "reactflow";
import { DataOut, dataTypes, DataIn } from "../src/types";
export interface NodeDetailsProps {
  selectedNode: Node;
  updateNode: (nodeId: string, data: any) => void;
  updateSelectedWorkflowName: (name: string) => void;
  close: () => void;
}
export default function FunctionNodeDetails({
  selectedNode,
  updateNode,
  close,
}: NodeDetailsProps) {
  const staticInputs = selectedNode.data.dataIns?.filter(
    (i: DataIn) => i.source === undefined
  );
  const parentInputs = selectedNode.data.dataIns?.filter(
    (i: DataIn) => i.source !== undefined
  );

  const staticInputsOffset =
    selectedNode.data.dataIns?.length - staticInputs?.length;
  return (
    <>
      <div className="flex justify-between items-center mr-12">
        <div className="text-slate-500">
          <h1 className="text-lg font-semibold text-foreground">Function</h1>
          Here you can edith the attributes of the selected node
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
      <div className="grid gap-2 mt-4">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="function name"
          onChange={(e) =>
            updateNode(selectedNode.id, {
              ...selectedNode.data,
              name: e.target.value,
            })
          }
          value={selectedNode.data.name}
        />
      </div>
      <div className="grid gap-2 mt-4">
        <div className="flex items-center">
          <Label htmlFor="type" className="mr-1">
            Function type
          </Label>
          <InfoButton infoText="This specifies the name of the serverless function used. Based on this name the function to execute is looked up in the type mappings file by APOLLO." />
        </div>
        <Input id="type" type="text" placeholder="type" />
      </div>
      <Separator className="my-4" />
      <h1 className="text-lg font-semibold text-foreground">Data Inputs</h1>
      <p className="text-sm text-slate-500">
        Connect outputs of other nodes to add them as inputs here. You can also
        add static inputs which describe constant values that are not dependent
        on results of other functions.
      </p>
      {parentInputs.length > 0 && (
        <>
          <h1 className="text-sm font-medium leading-none mt-4">Input from parents</h1>
      {parentInputs.map((input: DataIn, idx: number) => (
        <div key={idx.toString()} className="flex items-center justify-between">
          <p>{input.source}</p>
          <Button type="button" variant="ghost" size="icon">
            <Icons.remove className="w-5 text-destructive" strokeWidth={2} />
          </Button>
        </div>
      ))}</>)}
      {staticInputs.length > 0 && (
        <>
          <Label htmlFor="staticInputs">Static inputs</Label>

          <div className="grid gap-2 grid-cols-[2fr_1fr_2fr_30px] mt-4">
            {staticInputs.map((input: DataIn, idx: number) => (
              <>
                <Input
                  key={"name" + idx}
                  id="staticInputs"
                  type="text"
                  placeholder="function name"
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
                  type="button"
                  variant="ghost"
                  size="icon"
                  key={"del" + idx}
                  onClick={() =>
                    updateNode(selectedNode.id, {
                      ...selectedNode.data,
                      dataIns: selectedNode.data.dataIns.filter(
                        (_: DataIn, index: number) =>
                          index !== staticInputsOffset + idx
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
        </>
      )}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={() =>
          updateNode(selectedNode.id, {
            ...selectedNode.data,
            dataIns: [
              ...(selectedNode.data.dataIns ?? []),
              { name: "", type: "" },
            ],
          })
        }
      >
        <Icons.add className="w-4 h-4 mr-2" /> Add static inputs
      </Button>
      <Separator className="my-4" />
      <h1 className="text-lg font-semibold text-foreground">Data Outputs</h1>
      <p className="text-sm text-slate-500">
        Here you can specify new outputs of the function. If you can also add
        inputs to this function as outputs but it may be better to connect them
        from their origin.
      </p>
      {selectedNode.data.dataOuts.length > 0 && (
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
