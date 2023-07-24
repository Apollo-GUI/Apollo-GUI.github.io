import { NodeDetailsProps } from "./function-node-details";
import BaseDetailsSheet from "./base-details-sheet";
import NodeNameInput from "./node-name-input";

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

    </BaseDetailsSheet>
  );
}

