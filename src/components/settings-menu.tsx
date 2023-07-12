import { getDateTimeString } from "@/lib/helpers";
import { EditorProps } from "./editor";
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

export default function SettingsMenu({ selectedWorkflow, setSelectedWorkflow }: EditorProps) {
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
          <DropdownMenuItem>Export Apollo Yaml</DropdownMenuItem>
          <DropdownMenuItem>Download Graph</DropdownMenuItem>
          <DropdownMenuItem>Import Graph</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() =>setSelectedWorkflow(null)}>
          Back to Dashboard
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
