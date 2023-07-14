import { Label } from "./ui/label";
import { Input } from "./ui/input";
import InfoButton from "./info-button";
import { Separator } from "./ui/separator";
import { Node } from "reactflow";
import BaseDetailsSheet from "./base-details-sheet";
import DataInSection from "./data-in-section";
import DataOutSection from "./data-out-section";
import NodeNameInput from "./node-name-input";
import ParentSection from "./parent-section";
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
  return (
    <BaseDetailsSheet
      title="Function"
      description="Here you can edith the attributes of the selected node"
      close={close}
      selectedNode={selectedNode}
    >
      <NodeNameInput selectedNode={selectedNode} updateNode={updateNode} />
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
      <DataInSection selectedNode={selectedNode} updateNode={updateNode} />
      <Separator className="my-4" />
      <DataOutSection selectedNode={selectedNode} updateNode={updateNode} />
      <ParentSection selectedNode={selectedNode} updateNode={updateNode}/>
    </BaseDetailsSheet>
  );
}
