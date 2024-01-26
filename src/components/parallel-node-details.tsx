import { NodeDetailsProps } from "./function-node-details";
import BaseDetailsSheet from "./base-details-sheet";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import InfoButton from "./info-button";
import DataInSection from "./data-in-section";
import DataOutSection from "./data-out-section";
import NodeNameInput from "./node-name-input";
import FunctionPropertiesConstraints from "./function-properties-constraints";
import { ParallelNode } from "@/types";
import { Button } from "./ui/button";
import { Icons } from "./icons";

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
          <h1 className="text-sm font-medium leading-none mt-2">
            Input from parents
          </h1>
          {node.iterators.map((iterator, idx) => (
            <div
              key={`${node.iterators.length}-${idx}`}
              className="grid gap-2 grid-cols-[1fr_25px] items-center mt-2"
            >
              <Input
                id="iterator"
                type="text"
                placeholder="iterator variable/value"
                value={iterator}
                onChange={(e) => {
                  node.iterators[idx] = e.target.value;
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
              >
                <Icons.remove
                  className="w-5 text-destructive"
                  strokeWidth={2}
                  onClick={() => {
                    updateNode(selectedNode.id, {
                      ...selectedNode.data,
                      iterators: node.iterators.filter(
                        (_: string, i) => i !== idx,
                      ),
                    });
                  }}
                />
              </Button>
            </div>
          ))}
        </>
      )}

      <Button
        variant="outline"
        size="sm"
        className="mt-2"
        onClick={() => {
          updateNode(selectedNode.id, {
            ...selectedNode.data,
            iterators: [...(selectedNode.data.iterators ?? []), ""],
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
