import { useUpdateNodeInternals } from "reactflow";
import { UpdateNodeSectionProps } from "./data-in-section";
import { Icons } from "./icons";
import InfoButton from "./info-button";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export default function ParentSection({
  selectedNode,
  updateNode,
}: UpdateNodeSectionProps) {
  const updateNodeInternals = useUpdateNodeInternals();
  return selectedNode.parentNode ? (
    <>
      <Separator className="my-4" />
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-foreground mr-1">
          Parent Node
        </h1>
        <InfoButton infoText="Here you can remove the relationship to the parent node. All edges will be removed." />
      </div>
      <Button
        variant="destructive"
        size="sm"
        className="mt-2"
        onClick={() => {
          selectedNode.parentNode = undefined;
          selectedNode.extent = undefined;
          selectedNode.position = selectedNode.positionAbsolute ?? {
            x: 0,
            y: 0,
          };
          updateNodeInternals(selectedNode.id);
        }}
      >
        <Icons.remove className="w-4 h-4 mr-2" /> Remove from Parent
      </Button>
    </>
  ) : (
    <></>
  );
}
