import { NodeDetailsProps } from "./function-node-details";
import BaseDetailsSheet from "./base-details-sheet";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import InfoButton from "./info-button";
import DataInSection from "./data-in-section";
import DataOutSection from "./data-out-section";
import NodeNameInput from "./node-name-input";
import FunctionPropertiesConstraints from "./function-properties-constraints";
import { ParallelNode, dataTypes } from "@/types";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";
import { uuidv4 } from "@/lib/helpers";

export default function ParallelNodeDetails({
  selectedNode,
  updateNode,
  close,
}: NodeDetailsProps) {
  const node = selectedNode.data as ParallelNode;
  return (
    <BaseDetailsSheet
      title="Parallel"
      description="The parallel compound function expresses the simultaneous execution of all loop iterations. It is assumed that there are no data dependencies across loop iterations."
      close={close}
      selectedNode={selectedNode}
    >
      <NodeNameInput selectedNode={selectedNode} updateNode={updateNode} />
      <Separator className="my-4" />
      <div className="flex items-center mb-2">
        <h1 className="text-lg font-semibold text-foreground mr-1">Iterator</h1>
        <InfoButton infoText="The value of iterators is a list containing either the names of one or multiple dataIns of the parallelFor compound or a single integer (possibly specified via the corresponding dataOut of a function preceding the parallelFor)." />
      </div>
      {node.iterators.length > 0 && (
        <>
          <div className="grid gap-2 grid-cols-[2fr_1fr_25px] items-center mt-2">
            <Label>Iterator</Label>
            <Label>Element Type</Label>
            <div />
            {node.iterators.map((iterator) => (
              <>
                <Input
                  key={iterator.id}
                  id="iterator"
                  type="text"
                  placeholder="iterator variable/value"
                  value={iterator.name}
                  onChange={(e) => {
                    const index = node.iterators.findIndex(
                      (el: any) => el.id === iterator.id,
                    );
                    node.iterators[index].name = e.target.value;
                    updateNode(selectedNode.id, {
                      ...selectedNode.data,
                    });
                  }}
                />

                <Select
                  value={iterator.elementType}
                  key={"type" + iterator.id}
                  onValueChange={(e) => {
                    const index = node.iterators.findIndex(
                      (el: any) => el.id === iterator.id,
                    );
                    node.iterators[index].elementType = e;
                    updateNode(selectedNode.id, {
                      ...selectedNode.data,
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dataTypes
                      .filter((t) => t != "array" && t != "null")
                      .map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="w-8 p-0"
                >
                  <Icons.remove
                    className="w-5 text-destructive"
                    strokeWidth={2}
                    onClick={() => {
                      updateNode(selectedNode.id, {
                        ...selectedNode.data,
                        iterators: node.iterators.filter(
                          (it) => it.id !== iterator.id,
                        ),
                      });
                    }}
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
            iterators: [
              ...(selectedNode.data.iterators ?? []),
              { id: uuidv4() },
            ],
          });
        }}
      >
        <Icons.add className="w-4 h-4 mr-2" /> Add iterator
      </Button>

      <Separator className="my-4" />
      <DataInSection selectedNode={selectedNode} updateNode={updateNode} />
      <Separator className="my-4" />
      <DataOutSection selectedNode={selectedNode} updateNode={updateNode} />

      <FunctionPropertiesConstraints
        selectedNode={selectedNode}
        updateNode={updateNode}
      />
    </BaseDetailsSheet>
  );
}
