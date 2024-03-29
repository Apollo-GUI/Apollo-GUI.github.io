import { getDateTimeString } from "@/lib/helpers";
import { Icons } from "./icons";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Workflow } from "@/types";
import { downloadGraph, exportApolloYaml } from "@/lib/exporter";
import { useReactFlow } from "reactflow";

interface SettingsMenuProps {
  selectedWorkflow: Workflow;
  leavePage: () => void;
}

export default function SettingsMenu({
  selectedWorkflow,
  leavePage,
}: SettingsMenuProps) {
  const { toObject } = useReactFlow();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"icon"} className="mb-4">
          <Icons.settings className="h-8 w-8" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {selectedWorkflow.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              Last saved:{" "}
              {selectedWorkflow.lastSaved
                ? getDateTimeString(selectedWorkflow.lastSaved)
                : "never"}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() =>
              exportApolloYaml({
                name: selectedWorkflow.name,
                data: toObject(),
              })
            }
          >
            Export Apollo Yaml
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              downloadGraph({
                name: selectedWorkflow.name,
                data: toObject(),
              })
            }
          >
            Download Graph
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={leavePage}>
          Back to Dashboard
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
