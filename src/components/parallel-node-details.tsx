import { NodeDetailsProps } from "./function-node-details";
import BaseDetailsSheet from "./base-details-sheet";

export default function ParallelNodeDetails({
  selectedNode,
  close,
}: NodeDetailsProps) {
  return (
    <BaseDetailsSheet
      title="Parallel"
      description="Run multiple functions in parallel based an an iterator."
      close={close}
      selectedNode={selectedNode}
    >
    </BaseDetailsSheet>
  );
}

