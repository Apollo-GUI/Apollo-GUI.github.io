import { NodeDetailsProps } from "./function-node-details";
import BaseDetailsSheet from "./base-details-sheet";
import NodeNameInput from "./node-name-input";
import { Separator } from "./ui/separator";
import ConditionsSection from "./conditions-section";
import DataInSection from "./data-in-section";
import DataOutSection from "./data-out-section";
import FunctionPropertiesConstraints from "./function-properties-constraints";

export default function WhileNodeDetails({
  selectedNode,
  updateNode,
  close,
}: NodeDetailsProps) {
  return (
    <BaseDetailsSheet
      title="While"
      description="Continously run a section while a condition is true."
      close={close}
      selectedNode={selectedNode}
    >
      <NodeNameInput selectedNode={selectedNode} updateNode={updateNode} />
      <Separator className="my-4" />
      <ConditionsSection selectedNode={selectedNode} updateNode={updateNode} />
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
