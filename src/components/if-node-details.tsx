import { NodeDetailsProps } from "./function-node-details";
import BaseDetailsSheet from "./base-details-sheet";

export default function IfNodeDetails({
  selectedNode,
  close,
}: NodeDetailsProps) {
  return (
    <BaseDetailsSheet
      title="If condition"
      description="Branch execution of the workflow based on a condition."
      close={close}
      selectedNode={selectedNode}
    >
    </BaseDetailsSheet>
  );
}

