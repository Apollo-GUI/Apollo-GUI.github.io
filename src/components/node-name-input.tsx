import { UpdateNodeSectionProps } from "./data-in-section";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function NodeNameInput({
    selectedNode,
    updateNode,
  }: UpdateNodeSectionProps) {
  return (
    <div className="grid gap-2 mt-4">
    <Label htmlFor="name">Name</Label>
    <Input
      id="name"
      type="text"
      placeholder={selectedNode.type+" name"}
      onChange={(e) =>
        updateNode(selectedNode.id, {
          ...selectedNode.data,
          name: e.target.value,
        })
      }
      value={selectedNode.data.name}
    />
  </div>
  )
}
