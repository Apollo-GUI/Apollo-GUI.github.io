import { DataOut, IfNode } from "@/types";
import InfoButton from "./info-button";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { UpdateNodeSectionProps } from "./data-in-section";
import { useDataVariables, uuidv4 } from "@/lib/helpers";
import { useReactFlow, useUpdateNodeInternals } from "reactflow";
import { Popover, PopoverContent } from "./ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

export default function IfDataOutSection({
  selectedNode,
  updateNode,
}: UpdateNodeSectionProps) {
  const updateNodeInternals = useUpdateNodeInternals();
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-foreground mr-1">
          Data Outputs
        </h1>
        <InfoButton infoText="Here you can specify new outputs of the if. It the input can result form both the 'then' and 'else' path both internal variables have to be selected here." />
      </div>
      {selectedNode.data.ifDataOuts?.length > 0 && (
        <div className="grid grid-cols-[1fr_1fr_30px] gap-2 mt-2 items-center">
          <Label>Name</Label>
          <Label>Internal Variable</Label>
          <div />
          {selectedNode.data.ifDataOuts?.map((output: DataOut, idx: number) => (
            <>
              <Input
                key={"name" + idx}
                id="staticInputs"
                type="text"
                placeholder="name"
                value={output.name}
                onChange={(e) => {
                  selectedNode.data.ifDataOuts[idx].name = e.target.value;
                  updateNode(selectedNode.id, {
                    ...selectedNode.data,
                  });
                }}
              />
              <IfInternalVariableSelector
                selectedNode={selectedNode}
                updateNode={updateNode}
                ifNodeIndex={idx}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                key={"del" + idx}
                onClick={() => {
                  updateNode(selectedNode.id, {
                    ...selectedNode.data,
                    ifDataOuts: selectedNode.data.ifDataOuts.filter(
                      (_: DataOut, index: number) => index !== idx,
                    ),
                  });
                  updateNodeInternals(selectedNode.id);
                }}
              >
                <Icons.remove
                  className="w-5 text-destructive"
                  strokeWidth={2}
                />
              </Button>
            </>
          ))}
        </div>
      )}
      <div className="flex space-x-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => {
            updateNode(selectedNode.id, {
              ...selectedNode.data,
              ifDataOuts: [
                ...(selectedNode.data.ifDataOuts ?? []),
                { id: uuidv4(), name: "", type: "", sources: [] },
              ],
            });
            updateNodeInternals(selectedNode.id);
          }}
        >
          <Icons.add className="w-4 h-4 mr-2" /> Add new output
        </Button>
      </div>
    </>
  );
}

function IfInternalVariableSelector({
  selectedNode,
  updateNode,
  ifNodeIndex,
}: UpdateNodeSectionProps & { ifNodeIndex: number }) {
  const updateNodeInternals = useUpdateNodeInternals();
  const ifNode = selectedNode.data as IfNode;

  const { getNode } = useReactFlow();
  const { getTypeRec, getFullDataOutName } = useDataVariables();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <Icons.addCircle className="mr-2 h-4 w-4" />
          Variables
          {ifNode.ifDataOuts.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {ifNode.ifDataOuts.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {ifNode.ifDataOuts.length > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {ifNode.ifDataOuts.length} selected
                  </Badge>
                ) : (
                  ifNode.dataOuts
                    .filter(
                      (option) =>
                        ifNode.ifDataOuts[ifNodeIndex].sources?.find(
                          (s) => s == option.id,
                        ),
                    )
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.name}
                        className="rounded-sm px-1 font-normal"
                      >
                        {getFullDataOutName(
                          option.source ?? "",
                          option.id,
                          selectedNode,
                        )}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align="center">
        {ifNode.dataOuts.filter((n) => getNode(n.source ?? "") != undefined)
          .length == 0 ? (
          <div className="flex text-sm text-muted-foreground items-center p-2">
            <Icons.info className="min-w-[1rem] h-4 mr-3" />
            No data connected to the 'Outputs' section of the if condition
          </div>
        ) : (
          ifNode.dataOuts
            .filter((n) => getNode(n.source ?? "") != undefined)
            .map((option, i) => {
              const isSelected = ifNode.ifDataOuts[ifNodeIndex].sources?.find(
                (s) => s == option.id,
              );

              return (
                <div
                  key={(option.name ?? "") + i}
                  className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-muted"
                  onClick={() => {
                    if (isSelected) {
                      ifNode.ifDataOuts[ifNodeIndex].sources =
                        ifNode.ifDataOuts[ifNodeIndex].sources?.filter(
                          (s) => s !== option.id,
                        );
                      updateNode(selectedNode.id, {
                        ...selectedNode.data,
                      });

                      updateNodeInternals(selectedNode.id);
                    } else {
                      ifNode.ifDataOuts[ifNodeIndex].type = getTypeRec(
                        option.source ?? "",
                        option.id,
                      );
                      ifNode.ifDataOuts[ifNodeIndex].sources?.push(option.id);
                      updateNode(selectedNode.id, {
                        ...selectedNode.data,
                      });

                      updateNodeInternals(selectedNode.id);
                    }
                  }}
                >
                  <div
                    className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "opacity-50 [&_svg]:invisible",
                    )}
                  >
                    <Icons.check className={cn("h-4 w-4")} />
                  </div>
                  <span>
                    {getFullDataOutName(
                      option.source ?? "",
                      option.id,
                      selectedNode,
                    )}
                  </span>
                </div>
              );
            })
        )}
      </PopoverContent>
    </Popover>
  );
}
