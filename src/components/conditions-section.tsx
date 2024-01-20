import { UpdateNodeSectionProps } from "./data-in-section";
import { Icons } from "./icons";
import InfoButton from "./info-button";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Condition, conditionTypes, dataTypes } from "@/types";
import { Switch } from "./ui/switch";
import { uuidv4 } from "@/lib/helpers";
import { useUpdateNodeInternals } from "reactflow";

export default function ConditionsSection({
  selectedNode,
  updateNode,
}: UpdateNodeSectionProps) {
  const updateNodeInternals = useUpdateNodeInternals();
  return (
    <>
      <div className="flex items-center mb-2">
        <h1 className="text-lg font-semibold text-foreground mr-1">
          Condition
        </h1>
        <InfoButton infoText="" />
      </div>
      <div className="grid gap-2 grid-cols-[2fr_1fr_2fr_40px]">
        {selectedNode.data.conditions.map((condition: Condition) => (
          <>
            <Input
              id="condition1"
              type="text"
              placeholder="value/variable"
              value={condition.data1}
              key={"cond1" + condition.id}
              onChange={(e) => {
                const idx = selectedNode.data.conditions.findIndex(
                  (el: any) => el.id === condition.id,
                );
                selectedNode.data.conditions[idx].data1 = e.target.value;
                updateNode(selectedNode.id, {
                  ...selectedNode.data,
                });
              }}
            />
            <Select
              value={condition.operator}
              key={"type" + condition.id}
              onValueChange={(e) => {
                const idx = selectedNode.data.conditions.findIndex(
                  (el: any) => el.id === condition.id,
                );
                selectedNode.data.conditions[idx].operator = e;
                updateNode(selectedNode.id, {
                  ...selectedNode.data,
                });
              }}
            >
              <SelectTrigger>
                <SelectValue key={"typet" + condition.id} />
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
              key={"cond2" + condition.id}
              onChange={(e) => {
                const idx = selectedNode.data.conditions.findIndex(
                  (el: any) => el.id === condition.id,
                );
                selectedNode.data.conditions[idx].data2 = e.target.value;
                updateNode(selectedNode.id, {
                  ...selectedNode.data,
                });
              }}
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  key={"ops" + condition.id}
                >
                  <Icons.options className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-[220px]">
                <DropdownMenuItem
                  className="justify-between"
                  onSelect={(e) => {
                    e.preventDefault();
                    const idx = selectedNode.data.conditions.findIndex(
                      (el: any) => el.id === condition.id,
                    );
                    selectedNode.data.conditions[idx].negation =
                      !condition.negation;
                    updateNode(selectedNode.id, {
                      ...selectedNode.data,
                    });
                  }}
                >
                  Negation
                  <Switch checked={condition.negation} />
                </DropdownMenuItem>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    Data Type: {condition.type ?? "unset"}
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      value={condition.type}
                      onValueChange={(v) => {
                        const idx = selectedNode.data.conditions.findIndex(
                          (el: any) => el.id === condition.id,
                        );
                        selectedNode.data.conditions[idx].type = v;
                        updateNode(selectedNode.id, {
                          ...selectedNode.data,
                        });
                      }}
                    >
                      {dataTypes.map((dataTye) => (
                        <DropdownMenuRadioItem key={dataTye} value={dataTye}>
                          {dataTye}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuLabel>Combine With</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={condition.combinedWith}
                  onValueChange={(e) => {
                    const idx = selectedNode.data.conditions.findIndex(
                      (el: any) => el.id === condition.id,
                    );
                    selectedNode.data.conditions[idx].combinedWith = e;
                    updateNode(selectedNode.id, {
                      ...selectedNode.data,
                    });
                  }}
                >
                  <DropdownMenuRadioItem value="and">And</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="or">Or</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onSelect={() => {
                    updateNode(selectedNode.id, {
                      ...selectedNode.data,
                      conditions: selectedNode.data.conditions.filter(
                        (d: Condition) => d.id !== condition.id,
                      ),
                    });

                    updateNodeInternals(selectedNode.id);
                  }}
                  className="text-destructive"
                >
                  Remove Condition
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ))}
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
              selectedNode.data.conditions.push({
                id: uuidv4(),
                combinedWith: "and",
                type: "string",
              });
              updateNode(selectedNode.id, {
                ...selectedNode.data,
              });
              updateNodeInternals(selectedNode.id);
            }}
          >
            Combine with&nbsp;<b>AND</b>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              selectedNode.data.conditions[
                selectedNode.data.conditions.length - 1
              ].combinedWith = "or";
              selectedNode.data.conditions.push({
                id: uuidv4(),
                combinedWith: "or",
                type: "string",
              });
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
