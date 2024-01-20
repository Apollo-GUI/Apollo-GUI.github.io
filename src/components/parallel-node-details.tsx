import { NodeDetailsProps } from "./function-node-details";
import BaseDetailsSheet from "./base-details-sheet";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import InfoButton from "./info-button";
import DataInSection from "./data-in-section";
import DataOutSection from "./data-out-section";
import NodeNameInput from "./node-name-input";
import FunctionPropertiesConstraints from "./function-properties-constraints";

export default function ParallelNodeDetails({
  selectedNode,
  updateNode,
  close,
}: NodeDetailsProps) {
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
        <h1 className="text-lg font-semibold text-foreground mr-1">
          Iterator
        </h1>
        <InfoButton
          infoText="The value of iterators is a list containing either the names of one or multiple dataIns of the parallelFor compound or a single integer (possibly specified via the corresponding dataOut of a function preceding the parallelFor)."
        />
      </div>
      <Input id="iterator" type="text" placeholder="iterator value/variable" />
      <Separator className="my-4" />
      <DataInSection selectedNode={selectedNode} updateNode={updateNode}/>
      <Separator className="my-4" />
      <DataOutSection selectedNode={selectedNode} updateNode={updateNode}/>
      
      <FunctionPropertiesConstraints
        selectedNode={selectedNode}
        updateNode={updateNode}
      />
    </BaseDetailsSheet>
  );
}

