import { NodeDetailsProps } from "./function-node-details";
import BaseDetailsSheet from "./base-details-sheet";

export default function WhileNodeDetails({
  selectedNode,
  close,
}: NodeDetailsProps) {
  return (
    <BaseDetailsSheet
      title="While"
      description="Continously run a function while a condition is true."
      close={close}
      selectedNode={selectedNode}
    >
    </BaseDetailsSheet>
  );
}

