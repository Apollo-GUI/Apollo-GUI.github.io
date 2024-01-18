import { UpdateNodeSectionProps } from "./data-in-section";
import { Icons } from "./icons";
import InfoButton from "./info-button";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Condition, conditionTypes } from "@/types";

export default function ConditionsSection({
  selectedNode,
  updateNode,
}: UpdateNodeSectionProps) {
  return (
    <>
      <div className="flex items-center mb-2">
        <h1 className="text-lg font-semibold text-foreground mr-1">
          Condition
        </h1>
        <InfoButton infoText="" />
      </div>
      <div className="grid gap-2 grid-cols-[2fr_1fr_2fr_40px]">
        {selectedNode.data.conditions.map(
          (condition: Condition, idx: number) => (
            <>
              <Input
                id="condition1"
                type="text"
                placeholder="value/variable"
                value={condition.data1}
                key={"type" + idx}
                onChange={(e) => {
                  selectedNode.data.conditions[idx].data1 = e.target.value;
                  updateNode(selectedNode.id, {
                    ...selectedNode.data,
                  });
                }}
              />
              <Select
                value={condition.operator}
                key={"type" + idx}
                onValueChange={(e) => {
                  selectedNode.data.conditions[idx].operator = e;
                  updateNode(selectedNode.id, {
                    ...selectedNode.data,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {conditionTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                id="condition2"
                type="text"
                placeholder="value/variable"
                value={condition.data2}
                key={"type" + idx}
                onChange={(e) => {
                  selectedNode.data.conditions[idx].data2 = e.target.value;
                  updateNode(selectedNode.id, {
                    ...selectedNode.data,
                  });
                }}
              />

              <Button variant="secondary" size="icon">
                <Icons.options className="w-4 h-4" />
              </Button>
            </>
          ),
        )}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="mt-2">
            Add condition
            <Icons.down className="ml-2 h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onSelect={() => {
              selectedNode.data.conditions[
                selectedNode.data.conditions.length - 1
              ].combinedWith = "and";
              selectedNode.data.conditions.push({});
              updateNode(selectedNode.id, {
                ...selectedNode.data,
              });
            }}
          >
            Combine with&nbsp;<b>AND</b>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              selectedNode.data.conditions[
                selectedNode.data.conditions.length - 1
              ].combinedWith = "or";
              selectedNode.data.conditions.push({});
              updateNode(selectedNode.id, {
                ...selectedNode.data,
              });
            }}
          >
            Combine with&nbsp;<b>OR</b>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
