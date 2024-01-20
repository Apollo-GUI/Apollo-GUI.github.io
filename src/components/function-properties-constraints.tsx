import { UpdateNodeSectionProps } from "./data-in-section";
import PropteriesConstraintsDialog from "./properties-constraints-dialog";
import { Separator } from "./ui/separator";

export default function FunctionPropertiesConstraints({
  selectedNode,
  updateNode,
}: UpdateNodeSectionProps) {
  return (
    <>
      <Separator className="my-4" />
      <div className="flex items-center pb-2">
        <h1 className="text-lg font-semibold text-foreground mr-1">
          Properties and Constraints
        </h1>
      </div>

      <PropteriesConstraintsDialog
        properties={selectedNode.data.properties}
        constraints={selectedNode.data.constraints}
        fullWidth
        onChange={(properties, constraints) => {
          selectedNode.data.properties = properties;
          selectedNode.data.constraints = constraints;
          updateNode(selectedNode.id, {
            ...selectedNode.data,
          });
        }}
      />
    </>
  );
}
